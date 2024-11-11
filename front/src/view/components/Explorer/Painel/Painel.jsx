import style from "./Painel.module.scss";
import { Modal, Input } from "rsuite";
import ImageIcon from "@rsuite/icons/Image";
import FolderIcon from "@rsuite/icons/Folder";
import DirectIcon from "@rsuite/icons/Direct";
import TableIcon from "@rsuite/icons/Table";
import AudioIcon from "@rsuite/icons/Audio";
import VideoIcon from "@rsuite/icons/Video";
import PageIcon from "@rsuite/icons/Page";
import { List } from "rsuite";
import { Text } from "rsuite";

import { Form, Button } from "rsuite";

import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";
import FileDownloadIcon from "@rsuite/icons/FileDownload";
import CopyIcon from "@rsuite/icons/Copy";

import { IconButton, ButtonToolbar } from "rsuite";
import ApiClient from "../../../../utils/ApiClient";
import Toastr from "../../common/Toastr/Toastr";
import { useRef, useState } from "react";

function downloadFile(name, extend, content) {
  const byteCharacters = atob(content);
  const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0));
  const byteArray = new Uint8Array(byteNumbers);

  const blob = new Blob([byteArray], { type: getMimeType(extend) });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${name}.${extend}`;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function getMimeType(extension) {
  switch (extension) {
    case "txt":
      return "text/plain";
    case "jpg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "pdf":
      return "application/pdf";
    case "doc":
      return "application/msword";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    default:
      return "application/octet-stream";
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

const Painel = ({ data = null, onClick, toNode, clearPanel }) => {
  const [open, setOpen] = useState(false);
  const nameInput = useRef();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const IconStyle = { fontSize: "125px" };

  const toastr = Toastr();

  const deleteNode = () => {
    ApiClient.makeRequest("node", "deleteNode", { id: data.id })
      .then((response) => {
        toastr.showToast("Arquivo deletado", "success", "Sistema");
        toNode();
        clearPanel();
      })
      .catch((error) =>
        toastr.showToast("Erro ao deletar arquivo", "error", "Sistema")
      );
  };

  const renameNode = () => {
    ApiClient.makeRequest("node", "renameNode", {
      id: data.id,
      newName: nameInput.current.value,
    })
      .then((response) => {
        data.name = nameInput.current.value;
        toastr.showToast("Arquivo renomeado", "success", "Sistema");
        toNode(data.parentId);
        handleClose();
      })
      .catch((error) =>
        toastr.showToast("Erro ao renomear arquivo", "error", "Sistema")
      );
  };

  const getContentNodes = () => {
    ApiClient.makeRequest("node", "getContentNodes", { id: data.id })
      .then((response) => {
        downloadFile(data.name, data.type, response.buffer);
      })
      .catch((error) =>
        toastr.showToast("Erro ao renomear arquivo", "error", "Sistema")
      );
  };

  return (
    <>
      <Modal
        backdrop="static"
        role="alertdialog"
        open={open}
        onClose={handleClose}
        size="xs"
      >
        <Modal.Body>
          <Form fluid>
            <Form.Group controlId="name">
              <Form.ControlLabel>Novo nome</Form.ControlLabel>
              <Input defaultValue={data ? data.name : ""} ref={nameInput} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={renameNode} appearance="primary">
            Renomear
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <div className={style.rightBar}>
        <div className={style.container}>
          {data && (
            <>
              <div className={style.card}>
                <div
                  className={style.image}
                  style={
                    data.type === "folder"
                      ? {
                          color: "#69c3a5",
                        }
                      : {
                          opacity: ".8",
                        }
                  }
                >
                  {{
                    folder: <FolderIcon style={IconStyle} />,
                    jpg: <ImageIcon style={IconStyle} />,
                    png: <ImageIcon style={IconStyle} />,
                    jpeg: <ImageIcon style={IconStyle} />,
                    svg: <DirectIcon style={IconStyle} />,
                    gif: <ImageIcon style={IconStyle} />,
                    webp: <ImageIcon style={IconStyle} />,
                    ico: <ImageIcon style={IconStyle} />,
                    pdf: <PageIcon style={IconStyle} />,
                    doc: <PageIcon style={IconStyle} />,
                    docx: <PageIcon style={IconStyle} />,
                    xls: <TableIcon style={IconStyle} />,
                    xlsx: <TableIcon style={IconStyle} />,
                    mp4: <VideoIcon style={IconStyle} />,
                    avi: <VideoIcon style={IconStyle} />,
                    mkv: <VideoIcon style={IconStyle} />,
                    mp3: <AudioIcon style={IconStyle} />,
                    wav: <AudioIcon style={IconStyle} />,
                    flac: <AudioIcon style={IconStyle} />,
                  }[data.type] ?? <PageIcon style={IconStyle} />}
                </div>

                <div
                  style={{
                    paddingInline: "24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: "14px",
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <Text size="2rem">{data.name}</Text>
                    <Text muted size="2rem">
                      {data.type !== "folder" ? "." + data.type : ""}
                    </Text>
                  </div>
                </div>

                <List bordered size="md">
                  {/* <List.Item className={style.listItem}>
                  Tamanho: {"100 GB"}
                </List.Item> */}

                  {data.createdAt && data.updatedAt ? (
                    <>
                      <List.Item className={style.listItem}>
                        Criado em {formatDate(data.createdAt)}
                      </List.Item>
                      <List.Item className={style.listItem}>
                        Editado em {formatDate(data.updatedAt)}
                      </List.Item>
                    </>
                  ) : (
                    <></>
                  )}
                </List>
              </div>
              <ButtonToolbar
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {data.type !== "folder" ? (
                  <IconButton
                    icon={<FileDownloadIcon />}
                    onClick={getContentNodes}
                  >
                    Baixar
                  </IconButton>
                ) : (
                  <IconButton
                    appearance="primary"
                    icon={<CopyIcon />}
                    onClick={() => onClick(data)}
                  >
                    Abrir
                  </IconButton>
                )}

                <IconButton
                  color="red"
                  appearance="primary"
                  icon={<TrashIcon />}
                  onClick={deleteNode}
                >
                  Deletar
                </IconButton>
                <IconButton
                  color="blue"
                  appearance="primary"
                  icon={<EditIcon />}
                  onClick={handleOpen}
                >
                  Renomear
                </IconButton>
              </ButtonToolbar>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Painel;
