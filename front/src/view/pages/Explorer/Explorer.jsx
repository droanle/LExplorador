import { useEffect, useState } from "react";
import Content from "../../components/Explorer/Content/Content";
import Painel from "../../components/Explorer/Painel/Painel";
import Sidebar from "../../components/Explorer/Sidebar/Sidebar";
import style from "./Explorer.module.scss";
import Toastr from "../../components/common/Toastr/Toastr";
import ApiClient from "../../../utils/ApiClient";

const Explorer = () => {
  const [folderId, setFolderId] = useState(null);
  const [rootFolders, setRootFolders] = useState([]);
  const [folders, setFolders] = useState([]);
  const [panelData, setPanelData] = useState(null);

  const toastr = Toastr();

  const loading = () => {
    ApiClient.makeRequest("node", "getNodes", { parentId: folderId })
      .then((response) => {
        if (folderId == null) {
          setRootFolders(
            [
              {
                id: null,
                name: "Raiz",
                type: "folder",
              },
              ...response,
            ]
              .filter((item) => item.type === "folder")
              .sort((a, b) => {
                if (a.name == "Raiz") return -1;
                if (b.name == "Raiz") return 1;

                return a.name.localeCompare(b.name);
              })
          );
          setFolders(response);
        } else setFolders(response);
      })
      .catch((error) => {
        toastr.showToast("Erro ao consultar files", "error", "Sistema");
      });
  };

  useEffect(loading, [folderId]);

  return (
    <div className={style.container}>
      <Sidebar
        activeFolder={folderId}
        options={rootFolders}
        onClick={(folder) => {
          setFolderId(folder.id);
          setPanelData(folder);
        }}
      />
      <div className={style.content}>
        <Content
          items={folders.sort((a, b) => {
            if (a.type === "folder" && b.type !== "folder") return -1;
            if (a.type !== "folder" && b.type === "folder") return 1;

            return a.name.localeCompare(b.name);
          })}
          onClick={(folder) => setPanelData(folder)}
          onDoubleClick={(folder) => {
            setFolderId(folder.id);
            setPanelData(folder);
          }}
        />
        <Painel
          data={panelData ?? undefined}
          onClick={(folder) => {
            setFolderId(folder.id);
            setPanelData(folder);
          }}
          toNode={(id) => {
            loading();
            setFolderId(id);
          }}
          clearPanel={() => setPanelData(null)}
        />
      </div>
    </div>
  );
};

export default Explorer;
