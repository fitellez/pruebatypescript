/* eslint-disable import/first */
import React, { useEffect, useState, useMemo } from "react";
import { db, auth } from "../Firebase/Firebase";
import Header from "../components/DataTable/Header/Header";
import Pagination from "../components/DataTable/Pagination/Pagination";
// import Search from "../components/DataTable/Search/Search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faUserEdit,
  faUserTimes,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import $ from "jquery";
import toast, { Toaster } from "react-hot-toast";

type FormElement = React.FormEvent<HTMLFormElement>;

interface ITask {
  idDocument: string;
  nombre: string;
  descripcion: string;
  fechaini: string;
  fechafin: string;
  status: string;
}

const Tareas = () => {
  moment.locale("es-mx");
  const [listtask, setListTasks] = useState<ITask[]>([]);
  const [task, setTask] = useState<ITask>({
    idDocument: "",
    nombre: "",
    descripcion: "",
    fechaini: "",
    fechafin: "",
    status: "",
  });
  const [idDocumentDelete, setIdDocumentDelete] = useState("");
  /*========== State para las tablas ==========*/
  const [totalitems, setTotalItems] = useState(0);
  const [currentpage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState({ field: "", order: "" });
  const itemsPerPage = 5;
  const headers = [
    { name: "Nombre", field: "name", sortable: true },
    { name: "Descripción", field: "descripcion", sortable: false },
    { name: "Fecha de inicio", field: "fechainicio", sortable: false },
    { name: "Fecha de expiración", field: "fechafin", sortable: false },
    { name: "Status", field: "status", sortable: false },
    { name: "Acciones", field: "acciones", sortable: false },
  ];

  const getAllTask = async () => {
    const task: ITask[] = [];
    let idTask: any;
    await db
      .collection("Tareas")
      .get()
      .then((response) => {
        response.forEach(async (doc) => {
          idTask = {
            ...doc.data(),
            idDocument: doc.id,
          };
          task.push(idTask);
        });
        setListTasks(task);
      });
  };
  useEffect(() => {
    getAllTask();
  }, [setListTasks]);

  const AllArrayTareas = useMemo(() => {
    let tareas = listtask;
    try {
      if (search) {
        tareas = tareas.filter((doc) =>
          doc.nombre.toLowerCase().includes(search.toLocaleLowerCase())
        );
      }
    } catch (error) {
      console.log(error);
    }
    setTotalItems(tareas.length);

    if (sorting["field"]) {
      const reversed = sorting.order === "asc" ? 1 : -1;
      tareas = tareas.sort((a, b) => reversed * a.nombre.localeCompare(b.nombre));
    }
    return tareas.slice(
      (currentpage - 1) * itemsPerPage,
      (currentpage - 1) * itemsPerPage + itemsPerPage
    );
  }, [listtask, currentpage, search, sorting]);

  const onChangeInput = (e: { target: { name: any; value: any } }) => {
    setTask({
      ...task,
      [e.target.name]: e.target.value,
    });
  };

  const onChangeInputDate = (e: { target: { name: any; value: any } }) => {
    setTask({
      ...task,
      [e.target.name]: e.target.value,
    });
  };

  const onCreate = async (e: FormElement) => {
    e.preventDefault();

    await db
      .collection("Tareas")
      .doc()
      .set(task)
      .then(async (response) => {
        await getAllTask();
        toast.success("Tarea agregada", {
          duration: 4000,
          style: {
            borderRadius: "10px",
            background: "#428bca",
            color: "#fff",
          },
        });
        $("#modalDimissCreate").trigger("click");
        limpiarFormulario();
      });
  };

  const onGetTaskByID = async (id: any) => {
    // e.preventDefault();
    console.log(id);
    const task: ITask[] = [];
    let idTask: any;
    await db
      .collection(`Tareas`)
      .doc(id)
      .get()
      .then((response) => {
        console.log(response.data());
        setTask({
          idDocument: response.id,
          nombre: response.data()?.nombre,
          descripcion: response.data()?.descripcion,
          fechaini: response.data()?.fechaini,
          fechafin: response.data()?.fechafin,
          status: response.data()?.status,
        });
      });
  };

  const onGetStatusByID = async (id: any) => {
    // e.preventDefault();
    const task: ITask[] = [];
    let idTask: any;
    await db
      .collection(`Tareas`)
      .doc(id)
      .get()
      .then((response) => {
        console.log(response.data());
        setTask({
          idDocument: response.id,
          nombre: response.data()?.nombre,
          descripcion: response.data()?.descripcion,
          fechaini: response.data()?.fechaini,
          fechafin: response.data()?.fechafin,
          status: response.data()?.status,
        });
      });
  };

  const onUpdate = async (e: FormElement) => {
    e.preventDefault();
    await db
      .collection("Tareas")
      .doc(idDocument)
      .update({
        nombre,
        descripcion,
        fechaini,
        fechafin,
        status,
      })
      .then(async (response) => {
        toast.success("Tarea actualizada", {
          duration: 4000,
          style: {
            borderRadius: "10px",
            background: "#428bca",
            color: "#fff",
          },
        });
        $("#modalDimissUpdate").trigger("click");
        limpiarFormulario();
        await getAllTask();
      });
  };

  const onUpdateStatus = async (e: FormElement) => {
    e.preventDefault();
    await db
      .collection("Tareas")
      .doc(idDocument)
      .update({
        status,
      })
      .then(async (response) => {
        toast.success("Status actualizado", {
          duration: 4000,
          style: {
            borderRadius: "10px",
            background: "#428bca",
            color: "#fff",
          },
        });
        $("#modalDimissStatus").trigger("click");
        limpiarFormulario();
        await getAllTask();
      });
  };

  const onDelete = async (e: FormElement) => {
    e.preventDefault();
    await db
      .collection(`Tareas`)
      .doc(idDocumentDelete)
      .delete()
      .then(async (response) => {
        await getAllTask();

        toast.success("Tarea eliminada", {
          duration: 4000,
          style: {
            borderRadius: "10px",
            background: "#428bca",
            color: "#fff",
          },
        });
        $("#modalDimissDelete").trigger("click");
      });
  };

  const limpiarFormulario = () => {
    setTask({
      idDocument: "",
      nombre: "",
      descripcion: "",
      fechaini: "",
      fechafin: "",
      status: "",
    });

    //Reset input form
    // $('#newFarmacia')[0].reset();
    (document.getElementById("nombre") as HTMLInputElement).value = "";
    (document.getElementById("descripcion") as HTMLInputElement).value = "";
    (document.getElementById("fechaini") as HTMLInputElement).value = "";
    (document.getElementById("fechafin") as HTMLInputElement).value = "";
    (document.getElementById("status") as HTMLInputElement).value = "";
  };

  const cerrarSesion = () => {
    auth
      .signOut()
      .then(() => {})
      .catch(() => {});
  };

  const { idDocument, nombre, descripcion, fechaini, fechafin, status } = task || {};
  return (
    <>
      <div>
        <Toaster position="top-right" reverseOrder={true} />
      </div>
      <div className="container">
        <div className="mx-4 mx-lg-5">
          <div className="row my-5">
            <div className="col-12 Menu-BgColor">
              <div className="row">
                <div className="col-6">
                  <h4 className="my-3">Tareas</h4>
                </div>
                <div className="col-3 offset-1 text-right">
                  <button
                    type="button"
                    className="my-3 btn btn-success"
                    data-toggle="modal"
                    data-target="#AgregarPersona"
                  >
                    Agregar tarea
                    <FontAwesomeIcon icon={faUserPlus} className="ml-3 text-white" />
                  </button>
                </div>
                <div className="col-2 text-right">
                  <button
                    type="button"
                    className="my-3 btn btn-info"
                    onClick={cerrarSesion}
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table className="table table-hover Table-UI ">
                  <Header
                    headers={headers}
                    onSorting={(field: string, order: string) =>
                      setSorting({ field, order })
                    }
                  />
                  <tbody className="Table-UI-Body text-center">
                    {AllArrayTareas.map((item, index) => (
                      <tr key={index}>
                        <td>{item.nombre}</td>
                        <td>{item.descripcion}</td>
                        <td>{moment(item.fechaini).format("LL")}</td>
                        <td>{moment(item.fechafin).format("LL")}</td>
                        <td>{item.status}</td>
                        <td>
                          <div>
                            <button
                              className="btn btn-warning px-1 py-1 ml-1 ml-md-2 mt-3 mt-sm-0"
                              data-toggle="modal"
                              data-target="#EditarPersona"
                              onClick={(e) => onGetTaskByID(item.idDocument)}
                            >
                              <FontAwesomeIcon
                                icon={faUserEdit}
                                className="text-white ml-1"
                              />
                            </button>

                            <button
                              className="btn btn-danger px-1 py-1 ml-1 ml-md-2 mt-3 mt-sm-0"
                              data-toggle="modal"
                              data-target="#EliminarPersona"
                              onClick={() => setIdDocumentDelete(item.idDocument)}
                            >
                              <FontAwesomeIcon
                                icon={faUserTimes}
                                className="text-white ml-1"
                              />
                            </button>
                            <button
                              className="btn btn-success px-1 py-1 ml-1 ml-md-2 mt-3 mt-sm-0"
                              data-toggle="modal"
                              data-target="#ActualizarStatus"
                              onClick={(e) => onGetStatusByID(item.idDocument)}
                            >
                              <FontAwesomeIcon
                                icon={faEdit}
                                className="text-white ml-1"
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="col-3 offset-5 text-right">
                  <Pagination
                    total={totalitems}
                    itemsPerPage={itemsPerPage}
                    currentpage={currentpage}
                    onPageChange={(page: any) => setCurrentPage(page)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Agregar */}
          <div
            className="modal fade"
            id="AgregarPersona"
            tabIndex={1}
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content Menu-ModalShadow">
                <div className="text-center modal-header border-bottom-0">
                  <h4 className="w-100" id="exampleModalLabel">
                    Agregar Tarea
                  </h4>
                </div>
                <form className="Categoria-form" onSubmit={onCreate}>
                  <div className="modal-body px-5">
                    <div className="form-group">
                      <label htmlFor="nombre">Nombre:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="nombre"
                        name="nombre"
                        required
                        onChange={onChangeInput}
                        placeholder="Nombre"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="descripcion">Descripción:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="descripcion"
                        name="descripcion"
                        required
                        onChange={onChangeInput}
                        placeholder="Descripción"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="fechaini">Fecha de inicio:</label>
                      <input
                        type="date"
                        className="form-control"
                        id="fechaini"
                        name="fechaini"
                        required
                        onChange={onChangeInputDate}
                        placeholder="Dirección"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="fechafin">Fecha de expiración:</label>
                      <input
                        type="date"
                        className="form-control"
                        id="fechafin"
                        name="fechafin"
                        required
                        onChange={onChangeInputDate}
                        placeholder="Teléfono"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="status">Status:</label>
                      <select
                        name="status"
                        id="status"
                        onChange={onChangeInput}
                        className="form-control"
                        required
                      >
                        <option value={""}>Selecciona una opción</option>
                        <option value={"Pendiente"}>Pendiente</option>
                        <option value={"En proceso"}>En proceso</option>
                        <option value={"Realizada"}>Realizada</option>
                      </select>
                      {/* <input
                      type="text"
                      className="form-control"
                      id="status"
                      name="status"
                      required
                      onChange={onChangeInput}
                      placeholder="Teléfono"
                    /> */}
                    </div>
                  </div>
                  <div className="modal-footer">
                    <div className="row text-center">
                      <div className="col-6">
                        <button
                          className="btn btn-info px-5 py-2 mt-1"
                          id="modalDimissCreate"
                          data-dismiss="modal"
                        >
                          Cancelar
                        </button>
                      </div>
                      <div className="col-6">
                        <button type="submit" className="btn btn-success px-5 py-2 mt-1">
                          Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Editar */}
          <div
            className="modal fade"
            id="EditarPersona"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content Menu-ModalShadow">
                <div className="text-center modal-header border-bottom-0">
                  <h4 className="w-100" id="exampleModalLabel">
                    Editar Persona
                  </h4>
                </div>
                <form className="Categoria-form" id="newTask" onSubmit={onUpdate}>
                  <div className="modal-body px-5">
                    <div className="form-group">
                      <label htmlFor="nombre">Nombre:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="nombre"
                        name="nombre"
                        required
                        value={nombre}
                        onChange={onChangeInput}
                        placeholder="Nombre"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="descripcion">Descripción:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="descripcion"
                        name="descripcion"
                        required
                        value={descripcion}
                        onChange={onChangeInput}
                        placeholder="Descripción"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="fechaini">Fecha de inicio:</label>
                      <input
                        type="date"
                        className="form-control"
                        id="fechaini"
                        name="fechaini"
                        required
                        value={fechaini}
                        onChange={onChangeInputDate}
                        placeholder="Dirección"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="fechafin">Fecha de expiración:</label>
                      <input
                        type="date"
                        className="form-control"
                        id="fechafin"
                        name="fechafin"
                        required
                        value={fechafin}
                        onChange={onChangeInputDate}
                        placeholder="Teléfono"
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <div className="row text-center">
                      <div className="col-6">
                        <button
                          className="btn btn-info px-5 py-2 mt-1"
                          id="modalDimissUpdate"
                          data-dismiss="modal"
                        >
                          Cancelar
                        </button>
                      </div>
                      <div className="col-6">
                        <button type="submit" className="btn btn-success px-5 py-2 mt-1">
                          Actualizar
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Editar Tarea */}
          <div
            className="modal fade"
            id="ActualizarStatus"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content Categoria-inputShadow Categoria-modal">
                <div className="text-center modal-header border-bottom-0">
                  <h5
                    className="w-100 Categoria-Titulo modal-title"
                    id="exampleModalLabel"
                  >
                    Actualizar Status
                  </h5>
                </div>
                <form className="Categoria-form" onSubmit={onUpdateStatus}>
                  <div className="modal-body px-5">
                    <div className="form-group">
                      <label htmlFor="status">Status:</label>
                      <select
                        name="status"
                        id="status"
                        onChange={onChangeInput}
                        className="form-control"
                        value={status}
                        required
                      >
                        <option value={status} selected disabled hidden>
                          {status}
                        </option>
                        <option value={"Pendiente"}>Pendiente</option>
                        <option value={"En proceso"}>En proceso</option>
                        <option value={"Realizada"}>Realizada</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <div className="row text-center">
                      <div className="col-6">
                        <button
                          className="btn btn-info px-5 py-2 mt-1"
                          id="modalDimissStatus"
                          data-dismiss="modal"
                        >
                          Cancelar
                        </button>
                      </div>
                      <div className="col-6">
                        <button type="submit" className="btn btn-success px-5 py-2 mt-1">
                          Actualizar
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Eliminar */}
          <div
            className="modal fade"
            id="EliminarPersona"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content Categoria-inputShadow Categoria-modal">
                <div className="text-center modal-header border-bottom-0">
                  <h5
                    className="w-100 Categoria-Titulo modal-title"
                    id="exampleModalLabel"
                  >
                    Eliminar Tarea
                  </h5>
                </div>
                <form className="Categoria-form" onSubmit={onDelete}>
                  <div className="modal-footer">
                    <div className="row text-center">
                      <div className="col-12">
                        <p>¿Está seguro que desea eliminar esta tarea?</p>
                      </div>
                      <div className="col-6">
                        <button
                          className="btn btn-info px-5 py-2 mt-1"
                          id="modalDimissDelete"
                          data-dismiss="modal"
                        >
                          Cancelar
                        </button>
                      </div>
                      <div className="col-6">
                        <button type="submit" className="btn btn-success px-5 py-2 mt-1">
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tareas;
