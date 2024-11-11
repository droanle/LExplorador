import axios from "axios";
import Cookies from "universal-cookie";

const API_URL = "http://localhost:8001/";
const GRAPHQL_ENDPOINT = `${API_URL}graphql`;

class ApiClient {
  constructor() {
    this.cookies = new Cookies();
  }

  async makeRestRequest(method, url, data = {}) {
    const token = this.cookies.get("token");

    try {
      const response = await axios({
        url: `${API_URL}${url}`,
        method,
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          "Content-Type": "application/json",
        },
        data: method !== "GET" ? data : undefined,
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error("Error making REST request:", error.message);
      throw error;
    }
  }

  async makeGraphqlRequest(query, variables = {}, operation) {
    const token = this.cookies.get("token");
    try {
      var response;
      response = await axios.post(GRAPHQL_ENDPOINT, {
        query,
        variables,
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          "Content-Type": "application/json",
        },
      });

      return this.handleResponse(response, operation);
    } catch (error) {
      console.error("Error making GraphQL request:", error.message);
      throw error;
    }
  }

  async makeNodeRequest(data) {
    const isGraphql = this.cookies.get("isGraphql") ?? true;
    const token = this.cookies.get("token");

    const formData = new FormData();

    if (isGraphql) {
      const query = `
        mutation CreateNode($name: String!, $type: String!, $parentId: Int, $file: Upload) {
          createNode(name: $name, type: $type, parentId: $parentId, file: $file) {
            id
          }
        }
      `;

      formData.append(
        "operations",
        JSON.stringify({
          query,
          variables: {
            name: data.name,
            type: data.type,
            parentId: data.parentId || null,
            file: null,
          },
        })
      );
      formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
      formData.append("0", data.file);
    } else {
      formData.append("name", data.name);
      formData.append("type", data.type);
      if (data.parentId) formData.append("parentId", data.parentId);
      formData.append("file", data.file);
    }

    try {
      const response = await axios.post(
        isGraphql ? GRAPHQL_ENDPOINT : `${API_URL}node`,
        formData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            "Content-Type": "multipart/form-data",
          },
        }
      );


      return this.handleResponse(response, 'createNode');
    } catch (error) {
      console.error("Error making file request:", error.message);
      throw error;
    }
  }

  async makeRequest(type, operation, data = {}) {
    const isGraphql = this.cookies.get("isGraphql") ?? true;

    if (isGraphql) {
      const queries = {
        user: {
          login: `
            query Login($email: String!, $password: String!) {
                login(email: $email, password: $password)
            }
          `,
          register: `
            mutation Register($name: String!, $email: String!, $password: String!) {
                register(name: $name, email: $email, password: $password) {
                    id
                    name
                    email
                }
            }
          `,
        },
        node: {
          createNode: `
            mutation CreateNode($name: String!, $type: String!, $parentId: Int, $file: Upload) {
                createNode(
                    name: $name
                    type: $type
                    parentId: $parentId
                    file: $file
                ) {
                    id
                }
            }
         `,
          getContentNodes: `
            query GetContentNodes($id: Int!){
              getContentNodes(id: $id) {
                buffer
              }
            }
          `,
          deleteNode: `
            mutation DeleteNode($id: Int!) {
                deleteNode(id: $id)
            }
          `,
          renameNode: `
            mutation RenameNode($id: Int!, $newName: String!) {
                renameNode(id: $id, newName: $newName) {
                    id
                    name
                    type
                    parentId
                }
            }
          `,
          getNodes: `
            query GetNodes($parentId: Int) {
                getNodes(parentId: $parentId) {
                    id
                    name
                    type
                    parentId
                    createdAt
                    updatedAt
                }
            }
          `,
        },
      };

      if (operation == 'createNode') return this.makeNodeRequest(data);
      else return await this.makeGraphqlRequest(queries[type][operation], data, operation);
    } else {
      const handlers = {
        user: {
          register: (data) => this.makeRestRequest("POST", "register", data),
          login: (data) => this.makeRestRequest("POST", "login", data),
        },
        node: {
          createNode: (data) => this.makeNodeRequest(data),
          getContentNodes: (data) => this.makeRestRequest("GET", `node/contentNode/${data.id}`, {}),
          renameNode: (data) => this.makeRestRequest("PUT", `node/${data.id}/rename`, { newName: data.newName }),
          deleteNode: (data) => this.makeRestRequest("DELETE", `node/${data.id}`, {}),
          getNodes: (data) => this.makeRestRequest("GET", data.parentId ? `nodes?parentId=${data.parentId}` : "nodes", {}),
        },
      };

      return await handlers[type][operation](data);
    }
  }

  handleResponse(response, operation = null) {
    return new Promise((resolve, reject) => {
      if (response.status === 200) {
        const isGraphql = this.cookies.get("isGraphql") ?? true;
        resolve(isGraphql ? response.data.data[operation] : response.data);
      }

      return reject(response);
    });

  }
}


export default new ApiClient();
