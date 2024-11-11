import style from "./Main.module.scss";
import ImgMouse from "../../components/Login/Image/Img";
import { Carousel } from "rsuite";
import FormLogin from "../../components/Login/Form/Form";

const Main = () => {
  return (
    <div className={style.container}>
      <div className={style.left}>
        <Carousel className={style.carousel} shape="bar" autoplay>
          <img src="/imgs/1.jpeg" />
          <img src="/imgs/2.jpeg" />
          <img src="/imgs/3.jpeg" />
          <img src="/imgs/4.jpeg" />
        </Carousel>
        <ImgMouse />
      </div>
      <div className={style.form}>
        <FormLogin />
      </div>
    </div>
  );
};

export default Main;
