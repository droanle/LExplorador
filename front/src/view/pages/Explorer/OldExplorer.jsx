// // SearchBar.jsx
// import React, { useState, useRef } from "react";
// import { InputText } from "primereact/inputtext";
// import { Button } from "primereact/button";
// import { Sidebar } from "primereact/sidebar";
// import { Menu } from "primereact/menu";
// import { Avatar } from "primereact/avatar";
// import { Ripple } from "primereact/ripple";
// import { StyleClass } from "primereact/styleclass";
// import { Splitter, SplitterPanel } from "primereact/splitter";
// import { Card } from "primereact/card";

// import { IconField } from "primereact/iconfield";
// import { InputIcon } from "primereact/inputicon";

// import { ScrollPanel } from "primereact/scrollpanel";
// import { DataView } from "primereact/dataview";

// import { RadioButton } from "primereact/radiobutton";
// import { FileUpload } from "primereact/fileupload";

// import { Dialog } from "primereact/dialog";
// import { FloatLabel } from "primereact/floatlabel";

// import { InputSwitch } from "primereact/inputswitch";
// const styles = {
//   container: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: "20px",
//   },
//   searchContainer: {
//     display: "flex",
//     alignItems: "center",
//   },
//   input: {
//     width: "300px",
//     marginRight: "10px",
//   },
//   resultsList: {
//     listStyleType: "none",
//     padding: "0",
//     marginTop: "20px",
//   },
//   svg: {
//     marginRight: "12px",
//     width: "32px",
//   },
//   text: {
//     fontSize: "2.2rem",
//     fontWeight: "bold",
//     color: "#34d399",
//   },
//   normalText: {
//     marginBlock: "1px",
//   },
// };

// const ola = {
//   id: 1,
//   name: "string",
//   type: "pdf",
//   parentId: null,
// };

// const Explorer = () => {
//   const [visible, setVisible] = useState(false);

//   const [option, setOption] = useState(null);
//   const [date, setDate] = useState(null);
//   const [folderName, setFolderName] = useState("");

//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState([]);

//   const data = [
//     "Apple",
//     "Banana",
//     "Orange",
//     "Mango",
//     "Pineapple",
//     "Grapes",
//     "Strawberry",
//     "Blueberry",
//     "Raspberry",
//     "Blackberry",
//   ];

//   const items = [
//     {
//       label: "teste1",
//       command: () => {
//         console.log("Home Clicked");
//       },
//     },
//     {
//       label: "teste2",
//       command: () => {
//         console.log("Profile Clicked");
//       },
//     },
//     {
//       label: "teste3",
//       command: () => {
//         console.log("Settings Clicked");
//       },
//     },
//   ];

//   const handleSearch = () => {
//     const filteredResults = data.filter((item) =>
//       item.toLowerCase().includes(query.toLowerCase())
//     );
//     setResults(filteredResults);
//   };

//   const header = (
//     <img
//       alt="Card"
//       src="https://primefaces.org/cdn/primereact/images/usercard.png"
//     />
//   );
//   const footer = (
//     <div style={{ display: "flex", justifyContent: "space-evenly" }}>
//       <Button label="Renomear" icon="pi pi-pencil" severity="info" />
//       <Button label="Deletar" icon="pi pi-trash" severity="danger" />
//       <Button
//         label="Diretório Superior"
//         icon="pi pi-arrow-up"
//         severity="help"
//       />
//     </div>
//   );

//   const listTemplate = (items) => (
//     <div
//       style={{
//         display: "flex",
//         flexWrap: "wrap",
//         gap: "1rem",
//       }}
//     >
//       {items.map((item) => (
//         <Card
//           key={item.id}
//           title={item.name}
//           header={header}
//           style={{ width: "calc(25% - 1rem )" }}
//         />
//       ))}
//     </div>
//   );

//   console.log(new Array(10).fill(ola));

//   return (
//     <>
//       <Dialog
//         header="Header"
//         visible={visible}
//         style={{ width: "50vw" }}
//         onHide={() => {
//           if (!visible) return;
//           setVisible(false);
//         }}
//         footer={
//           <div>
//             <Button
//               label="Cancelar"
//               icon="pi pi-times"
//               onClick={() => setVisible(false)}
//               className="p-button-text"
//             />
//             <Button
//               label="Criar"
//               icon="pi pi-check"
//               onClick={() => setVisible(false)}
//               autoFocus
//             />
//           </div>
//         }
//       >
//         <div
//           style={{
//             display: "flex",
//             gap: "12px",
//             alignItems: "center",
//             marginBottom: "8px",
//           }}
//         >
//           <InputSwitch checked={date} onChange={(e) => setDate(e.value)} />
//           <label htmlFor="uploadFile">Pasta</label>
//         </div>

//         <div style={{ display: "flex", gap: "12px" }}>
//           <FloatLabel style={{ width: "65%" }}>
//             <label htmlFor="folderName">Nome</label>
//             <InputText
//               id="folderName"
//               style={{ width: "100%" }}
//               value={folderName}
//               onChange={(e) => setFolderName(e.target.value)}
//               placeholder="Digite o nome da pasta"
//             />
//           </FloatLabel>

//           <FileUpload
//             name="file"
//             mode="basic"
//             chooseLabel="Browse"
//             maxFileSize={1000000}
//           />
//         </div>
//       </Dialog>

//       <Splitter
//         style={{
//           position: "absolute",
//           left: "0",
//           top: "0",
//           width: "100%",
//           height: "100%",
//           background: "transparent",
//         }}
//       >
//         <SplitterPanel size={22} minSize={22}>
//           <div style={{ width: "100%" }}>
//             <div style={styles.container}>
//               <svg
//                 width="56"
//                 height="48"
//                 viewBox="0 0 56 47"
//                 style={styles.svg}
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   fill-rule="evenodd"
//                   clip-rule="evenodd"
//                   d="M19.4579 0H0V43.9375L2.3125 46.25H53.1875L55.5 43.9375V4.625H24.083L22.4479 2.98985L19.4579 0ZM22.1673 9.25L17.5421 4.625H4.625V41.625H50.875V16.1875H29.1048L22.1673 9.25ZM50.875 11.5625V9.25H28.708L31.0205 11.5625H50.875Z"
//                   fill="#34d399"
//                 />
//                 <path
//                   d="M8 14.0412C8 12.0917 9.19971 11 10.8118 11C12.4239 11 13.6236 12.0917 13.6236 14.0412V33.6168H20.2994C22.2103 33.6168 23.0363 35.0997 22.9988 36.4241C22.925 37.7133 21.949 39 20.3006 39H10.9243C9.5 37.5 9.5 37.5 8 35.8015V14.0412Z"
//                   fill="#34d399"
//                 />
//               </svg>
//               <h1 style={styles.text}>LExplorador</h1>
//             </div>
//             <div style={{ width: "100%", padding: "12px" }}>
//               <Menu
//                 model={items}
//                 style={{ width: "100%", fontSize: "1.5rem" }}
//               />
//             </div>
//           </div>
//         </SplitterPanel>
//         <SplitterPanel size={54} minSize={40}>
//           <div
//             style={{ width: "100%", marginTop: "38px", paddingInline: "18px" }}
//           >
//             <IconField iconPosition="right">
//               <InputText
//                 placeholder="Search"
//                 style={{ width: "100%", height: "47px" }}
//               />
//               <InputIcon className="pi pi-search"> </InputIcon>
//             </IconField>

//             {/* <DataView
//               value={new Array(10).fill(ola)}
//               listTemplate={listTemplate}
//               style={{ background: "transparent" }}
//             /> */}

//             <ScrollPanel
//               style={{
//                 width: "100%",
//                 height: "calc(100% - 47px)",
//                 paddingBlock: "14px",
//               }}
//             >
//               {listTemplate(new Array(10).fill(ola))}
//             </ScrollPanel>
//           </div>
//         </SplitterPanel>
//         <SplitterPanel size={24} minSize={18}>
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "space-between",
//               width: "100%",
//               paddingBlock: "38px",
//               paddingInline: "18px",
//             }}
//           >
//             <Card title="Name" subTitle="Type" footer={footer} header={header}>
//               <div style={{ lineHeight: "1.6" }}>
//                 <p style={styles.normalText}>
//                   <strong>Data de Criação:</strong> 00/00/0000
//                 </p>
//                 <p style={styles.normalText}>
//                   <strong>Última Edição:</strong> 00/00/0000
//                 </p>
//                 {/* <p style={styles.normalText}>
//                   <strong>Tamanho:</strong> 1 GB
//                 </p> */}
//               </div>
//             </Card>

//             <Button
//               label="Adicionar arquivo ou pasta"
//               icon="pi pi-plus"
//               onClick={() => setVisible(true)}
//             />
//           </div>
//         </SplitterPanel>
//       </Splitter>

//       {/* <div style={styles.container}>
//         <h2>Search Fruits</h2>
//         <div style={styles.searchContainer}>
//           <InputText
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Search..."
//             style={styles.input}
//           />
//           <Button label="Search" onClick={handleSearch} />
//         </div>
//         <ul style={styles.resultsList}>
//           {results.map((item, index) => (
//             <li key={index}>{item}</li>
//           ))}
//         </ul>
//       </div> */}
//     </>
//   );
// };

// export default Explorer;
