import React, { useState } from "react";
import "../Assets/Styles/Login.scss";
import { auth } from "../Firebase/Firebase";
import toast, { Toaster } from "react-hot-toast";

type FormElement = React.FormEvent<HTMLFormElement>;
const Registro = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async (e: FormElement) => {
    e.preventDefault();
    await auth
      .signInWithEmailAndPassword(email, password)
      .then((response: any) => {
        console.log("Session Iniciada");
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const onRegister = async (e: any) => {
    e.preventDefault();
    await auth
      .createUserWithEmailAndPassword(email, password)
      .then((response: any) => {
        toast.success("Usuario creado", {
          duration: 4000,
          style: {
            borderRadius: "10px",
            background: "#428bca",
            color: "#fff",
          },
        });
      })
      .catch((error: any) => {
        if (error.code === "auth/email-already-in-use") {
          toast.error(`El correo ya fue registrado`, {
            style: {
              borderRadius: "10px",
              background: "#f14950",
              color: "#fff",
            },
          });
        }
      });
  };
  return (
    <>
      <div>
        <Toaster position="top-right" reverseOrder={true} />
      </div>
      <div className="login-Body h-100">
        <form className="form-signin" onSubmit={onRegister}>
          {/* <img className="mb-4" src="../../assets/brand/bootstrap-solid.svg" alt="" width="72" height="72"> */}
          <h1 className="h3 mb-3 font-weight-normal">Registro</h1>
          <label htmlFor="inputEmail" className="sr-only">
            Email
          </label>
          <input
            type="email"
            id="inputEmail"
            className="form-control"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <label htmlFor="inputPassword" className="sr-only">
            Contraseña
          </label>
          <input
            type="password"
            id="inputPassword"
            className="form-control"
            placeholder="Contraseña"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="py-3"></div>
          <button className="btn btn-lg btn-primary btn-block" type="submit">
            Registro
          </button>

          <div className="text-center pt-5">
            <a href="/">¿Ya tienes una cuenta? Inicia sesión</a>
          </div>
        </form>
      </div>
    </>
  );
};

export default Registro;
