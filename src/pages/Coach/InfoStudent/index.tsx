import { Container } from "./styles";
import PurpleButton from "../../../components/PurpleButton";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiMyGym } from "../../../services/api";
import RegisterWorkout from "../../../components/RegisterWorkout";
import RegisterPhisicalAssessment from "../../../components/RegisterPhisicalAssessment";
import Modal from "../../../components/Modal";
import { useWindowWidth } from "../../../providers/WindowWidth";
import Chart from "react-apexcharts";
import { motion } from "framer-motion";

interface RoomParams {
  id: string;
}

const InfoStudent = () => {
  const [infoStudent, setInfoStudent] = useState<any>({});
  const [newWorkout, setNewWorkout] = useState(false);
  const [newPhisical, setNewPhisical] = useState(false);
  const { windowWidth } = useWindowWidth();
  const params = useParams<RoomParams>();
  const Id = params.id;
  let token = localStorage.getItem("@tokenMyGym") || "";
  if (token !== "") {
    token = JSON.parse(token);
  }

  const options = {
    chart: {
      id: "basic-bar",
    },
    xaxis: {
      categories: [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ],
    },
    yaxis: {
      show: false,
    },
    dataLabels: {
      enabled: windowWidth >= 768 ? true : false,
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "70",
      },
    },
  };

  const series = [
    {
      name: "IMC",
      data: infoStudent?.physicalAssessment?.imc,
    },
    {
      name: "Peso",
      data: infoStudent?.physicalAssessment?.weight,
    },
    {
      name: "Gordura",
      data: infoStudent?.physicalAssessment?.taxFat,
    },
    {
      name: "Massa Magra",
      data: infoStudent?.physicalAssessment?.leanMass,
    },
  ];

  const GetInfo = () => {
    apiMyGym
      .get(`students?id=${Id}&_embed=workouts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setInfoStudent(response.data[0]))
      .catch((err) => console.log(err));
  };

  const OpenRegisterWorkout = () => {
    setNewWorkout(!newWorkout);
  };

  const OpenPhisical = () => {
    setNewPhisical(!newPhisical);
  };

  useEffect(() => {
    GetInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <section className="home--Student">
        <Container percentage={(16 / 20) * 100}>
          <div className="container--user">
            <div className="status">
              <figure>
                <img
                  src="http://s2.glbimg.com/c-WVrLcmkvQbU_7kolZlss_kZ3k=/e.glbimg.com/og/ed/f/original/2015/06/09/thinkstockphotos-478000165.jpg"
                  alt="Usuário"
                />
                <figcaption>{infoStudent.name}</figcaption>
              </figure>
            </div>
            <div className="trainingPerformed">
              <h2>Treinos Realizados: 16/18</h2>
              <div className="percentageBar">
                <div>
                  <span>16/20</span>
                </div>
              </div>
            </div>
          </div>
          <div className="boxs">
            <div className="workouts--chart">
              <h2>Treinos Cadastrados</h2>
              <div>
                <ul>
                  {infoStudent?.workouts?.map((workout: any) => (
                    <li key={workout.group}>{workout.group}</li>
                  ))}
                </ul>
              </div>

              <PurpleButton small={false} onClick={OpenRegisterWorkout}>
                Novo Treino
              </PurpleButton>
            </div>
            <div className="progression--chart">
              <h2>Progressão</h2>
              <div>
                <Chart
                  options={options}
                  series={series}
                  type="bar"
                  width="100%"
                  height="90%"
                />
              </div>
              <PurpleButton small={false} onClick={OpenPhisical}>
                Nova Avaliação
              </PurpleButton>
            </div>
          </div>
        </Container>
        {newWorkout && (
          <Modal open={newWorkout} handleClose={OpenRegisterWorkout}>
            <RegisterWorkout
              setOpen={OpenRegisterWorkout}
              getInfo={GetInfo}
              infoStudent={infoStudent}
            />
          </Modal>
        )}
        {newPhisical && (
          <Modal open={newPhisical} handleClose={OpenPhisical}>
            <RegisterPhisicalAssessment
              setOpen={OpenPhisical}
              getInfo={GetInfo}
              infoStudent={infoStudent}
            />
          </Modal>
        )}
      </section>
    </motion.div>
  );
};

export default InfoStudent;
