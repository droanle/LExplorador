import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Schema } from "rsuite";
import style from "./Form.module.scss";
import Toastr from "../../common/Toastr/Toastr";
import ApiClient from "../../../../utils/ApiClient";
import Cookies from "universal-cookie";

const year = new Date().getFullYear();
const { StringType } = Schema.Types;
const model = Schema.Model({
  email: StringType().isEmail("Por favor, insira um e-mail válido."),
});

const TextField = ({ name, label, accepter, ...rest }) => (
  <Form.Group controlId={name}>
    <Form.ControlLabel>{label} </Form.ControlLabel>
    <Form.Control name={name} accepter={accepter} {...rest} />
  </Form.Group>
);

function FormLogin() {
  const cookies = new Cookies();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const toastr = Toastr();

  const handleToggleLogin = () => setIsLogin(!isLogin);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email == "" || password == "")
      toastr.showToast(
        "Preencha todos os campos",
        "warning",
        isLogin ? "Login" : "Registrar-se"
      );
    else if (!isLogin && name == "")
      toastr.showToast("Preencha todos os campos", "warning", "Registrar-se");
    else
      try {
        if (isLogin)
          ApiClient.makeRequest("user", "login", { email, password })
            .then((responce) => {
              console.log(responce);
              if (responce) {
                cookies.set("token", responce);
                toastr.showToast(
                  "Operação realizada com sucesso!",
                  "success",
                  "Login"
                );
                navigate("/exploring");
              } else
                toastr.showToast(
                  "Senha ou email incorretas",
                  "warning",
                  "Login"
                );
            })
            .catch((error) =>
              toastr.showToast(
                "Erro de execução\n tente novamente mais tarde",
                "error",
                "Sistema"
              )
            );
        else
          ApiClient.makeRequest("user", "register", { name, email, password })
            .then((responce) => {
              console.log(responce);
              if (responce) {
                toastr.showToast(
                  "Registro criado!\n Efetue o login para entrar em sua conta.",
                  "success",
                  "Registrar-se"
                );
                setIsLogin(true);
              } else
                toastr.showToast(
                  "Ultilize outro email",
                  "warning",
                  "Registrar-se"
                );
            })
            .catch((error) =>
              toastr.showToast(
                "Erro de execução\n tente novamente mais tarde",
                "error",
                "Sistema"
              )
            );
      } catch (error) {
        toastr.showToast(
          "Erro de execução\n tente novamente mais tarde",
          "error",
          "Sistema"
        );
      }
  };

  return (
    <div className={style.container}>
      <div className={style.header}>
        Seja Bem-vindo(a) ao <span>LExplorador!</span>
      </div>
      <div className={style.form}>
        <Form model={model} fluid>
          {!isLogin && (
            <TextField
              name="name"
              label="Nome"
              onChange={(value) => setName(value)}
            />
          )}
          <TextField
            name="email"
            label="E-mail"
            onChange={(value) => setEmail(value)}
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            autoComplete="off"
            onChange={(value) => setPassword(value)}
          />
          <div className={style.btns}>
            <Button
              appearance="primary"
              type="submit"
              block
              className={style.btnLogin}
              onClick={handleSubmit}
            >
              {isLogin ? "Entrar" : "Registrar-se"}
            </Button>
            <Button
              appearance="default"
              type="submit"
              block
              onClick={handleToggleLogin}
            >
              {isLogin ? (
                <span>
                  Você ainda não tem uma conta? <strong>Registre-se</strong>
                </span>
              ) : (
                "Entrar em uma conta"
              )}
            </Button>
          </div>
        </Form>
      </div>
      <div className={style.footer}>
        Powered by <span>OctaSystems</span> @{year}
      </div>
    </div>
  );
}
export default FormLogin;
