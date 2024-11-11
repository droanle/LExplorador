import style from "./img.module.scss";
import React, { useState } from "react";

function ImgMouse() {
  const [mouse, setMouse] = useState({});

  const handleMouseMove = (e) => {
    const { offsetX, offsetY, target } = e.nativeEvent;
    const { clientWidth, clientHeight } = target;

    const rotateX = ((offsetY - clientHeight / 2) / clientHeight) * 25;
    const rotateY = ((offsetX - clientWidth / 2) / clientWidth) * -25;

    setMouse({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    });
  };

  const handleMouseLeave = () => {
    setMouse({ transform: "perspective(1000px) rotateX(0) rotateY(0)" });
  };

  return (
    <div className={style.ImgContainer}>
      <img
        src="./imgs/logo.png"
        alt="Logo"
        className={style.Img}
        style={mouse}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
}

export default ImgMouse;
