import style from "./Content.module.scss";
import { Panel } from "rsuite";
import ImageIcon from "@rsuite/icons/Image";
import FolderIcon from "@rsuite/icons/Folder";
import DirectIcon from "@rsuite/icons/Direct";
import TableIcon from "@rsuite/icons/Table";
import AudioIcon from "@rsuite/icons/Audio";
import VideoIcon from "@rsuite/icons/Video";
import PageIcon from "@rsuite/icons/Page";
import { Text } from "rsuite";

const Content = ({
  items = [],
  onDoubleClick = () => {},
  onClick = () => {},
}) => {
  const IconStyle = { fontSize: "88px" };

  return (
    <div className={style.container}>
      {items.map((item) => (
        <Panel
          shaded
          bordered
          bodyFill
          className={style.card}
          style={{
            display: "inline-block",
            width: "calc(20% - 15px)",
            gap: "16px",
          }}
          onClick={() => onClick(item)}
          onDoubleClick={
            item.type === "folder" ? () => onDoubleClick(item) : undefined
          }
        >
          <div
            style={{
              ...{
                display: "flex",
                justifyContent: "center",
                paddingTop: "20px",
                paddingBottom: "16px",
              },
              ...(item.type === "folder"
                ? {
                    color: "#69c3a5",
                  }
                : {
                    opacity: ".8",
                  }),
            }}
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
            }[item.type] ?? <PageIcon style={IconStyle} />}
          </div>

          <div
            style={{
              paddingInline: "24px",
              display: "flex",
              paddingBottom: "14px",
            }}
          >
            <Text size="1.5rem">{item.name}</Text>
            <Text>
              {item.type !== "folder" ? (
                <Text muted size="1.5rem">
                  {"." + item.type}{" "}
                </Text>
              ) : (
                <></>
              )}
            </Text>
          </div>
        </Panel>
      ))}
    </div>
  );
};

export default Content;
