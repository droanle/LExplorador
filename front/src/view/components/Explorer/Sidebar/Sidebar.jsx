import { useRef, useState } from "react";
import style from "./Sidebar.module.scss";
import { Button, Divider, Modal } from "rsuite";
import { Plus, SignOut } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { Form, Checkbox, Input } from "rsuite";
import { Tag } from "rsuite";
import { Uploader } from "rsuite";

import VideoIcon from "@rsuite/icons/Video";
import ImageIcon from "@rsuite/icons/Image";
import PageIcon from "@rsuite/icons/Page";
import AudioIcon from "@rsuite/icons/Audio";
import BranchIcon from "@rsuite/icons/Branch";
import FolderFillIcon from "@rsuite/icons/FolderFill";

import { Tree } from "rsuite";
import ApiClient from "../../../../utils/ApiClient";
import Toastr from "../../common/Toastr/Toastr";
import Cookies from "universal-cookie";

const TreeNode = ({ children, ...rest }) => {
  return (
    <div {...rest} style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {children}
    </div>
  );
};

function getIconByName(name) {
  name = name.toLowerCase();
  const icons = [
    [["videos", "video"], <VideoIcon />],
    [["pictures", "picture", "Imagens", "Imagem"], <ImageIcon />],
    [["documents", "document", "documentos", "documento"], <PageIcon />],
    [["musics", "music", "musicas", "musica"], <AudioIcon />],
    [["raiz"], <BranchIcon />],
  ];

  const icon = icons.find((icon) => icon[0].indexOf(name) != -1);

  if (icon) return icon[1];
  else return <FolderFillIcon />;
}

const data = [
  {
    label: "Root",
    value: ["Root", null],
    children: [],
  },
];

const Sidebar = ({ options = [], activeFolder, onClick }) => {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const fetchNodes = async (options) => {
    const response = await ApiClient.makeRequest("node", "getNodes", {
      parentId: options.value[1],
    });

    return response
      .filter((item) => item.type === "folder")
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((node) => ({
        label: node.name,
        value: [options.value[0] + "/" + node.name, node.id],
        children: [],
      }));
  };

  const toastr = Toastr();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [rootDir, setRootDir] = useState(["Root", null]);
  const [isFolder, setIsFolder] = useState(false);
  const [file, setFile] = useState([]);
  const [name, setName] = useState([]);
  const uploader = useRef();

  const handleUpload = () => {
    const fileName = file[0] ? file[0].name.split(".") : "";

    console.log(fileName[fileName.length - 1]);

    ApiClient.makeRequest("node", "createNode", {
      name: name,
      type: isFolder ? "folder" : fileName[fileName.length - 1],
      parentId: rootDir[1],
      file: file[0] ? file[0].blobFile : null,
    })
      .then((response) => {
        setOpen(false);
        toastr.showToast(
          isFolder ? "Pasta criada" : "Arquivo enviado",
          "success",
          "Sistema"
        );

        navigate(0);
      })
      .catch((error) => {
        console.log(error);

        toastr.showToast(
          isFolder ? "Erro ao criar pasta" : "Erro ao enviar arquivo ",
          "error",
          "Sistema"
        );
      });
  };

  const backToLogin = () => {
    cookies.set("token", "");
    navigate("/");
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>Subir arquivo ou criar pasta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid>
            <Form.Group controlId="tree">
              <Form.ControlLabel>
                Criar em: <Tag size="sm">{rootDir[0]}</Tag>
              </Form.ControlLabel>
              <Tree
                data={data}
                value={rootDir}
                onChange={(rootDir) => setRootDir(rootDir)}
                getChildren={fetchNodes}
                height=""
                renderTreeNode={(node) => {
                  return (
                    <TreeNode>
                      {node.children ? <FolderFillIcon /> : <PageIcon />}{" "}
                      {node.label}
                    </TreeNode>
                  );
                }}
              />
            </Form.Group>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <Form.Group controlId="type">
                <Form.ControlLabel>Tipo:</Form.ControlLabel>
                <Checkbox onChange={(...isFolder) => setIsFolder(isFolder[1])}>
                  Pasta
                </Checkbox>
              </Form.Group>

              <Form.Group controlId="name">
                <Form.ControlLabel>Nome do arquivo</Form.ControlLabel>
                <Input onChange={(value) => setName(value)} />
              </Form.Group>
            </div>

            <Form.Group controlId="file">
              <Uploader
                fileList={file}
                autoUpload={false}
                action="#"
                multiple={false}
                onChange={(files) => setFile([files[files.length - 1]])}
                fileListVisible={false}
                ref={uploader}
              >
                <Button>
                  {file[0] ? file[0].name : "Selecione o arquivo"}
                </Button>
              </Uploader>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleUpload} appearance="primary">
            Criar
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <div
        className={style.container}
        style={{
          width: expanded ? "20dvw" : "10dvw",
        }}
      >
        <div className={style.header} onClick={() => setExpanded(!expanded)}>
          <img src="imgs/logo.png" alt="teste" />
          {expanded && <span>LExplorer</span>}
        </div>
        <div className={style.options}>
          {options.map((item, index) => {
            const icon = getIconByName(item.name);

            return (
              <Button
                key={index}
                className={style.button}
                appearance={
                  item.id === activeFolder && activeFolder != null
                    ? "primary"
                    : "default"
                }
                startIcon={icon ? icon : undefined}
                style={{
                  color:
                    item.id === activeFolder && activeFolder != null
                      ? "var(--rs-body)"
                      : "",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
                block
                onClick={() => onClick(item)}
              >
                {item.name}
              </Button>
            );
          })}
        </div>
        <div className={style.footer}>
          <Button
            className={style.button}
            appearance="primary"
            block
            startIcon={<Plus weight="bold" size={20} />}
            onClick={handleOpen}
          >
            {expanded ? "Adicionar novo" : null}
          </Button>
          <Divider />
          <Button
            className={style.button}
            appearance="default"
            block
            startIcon={<SignOut weight="bold" size={20} />}
            onClick={backToLogin}
          >
            {expanded ? "Logout" : null}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
