import ProjectImg from "../assets/project_img.jpg";
import TPlanetMap from "../assets/tplanet_map.png";
import CSR from "../assets/2nd-home-csr.png";
import SDGs from "../assets/sdgs.png";
import DigitalTwin from "../assets/digital-twin.png";

const Home = () => {
  return (
    <section className="flex-grow">
      <div className="container mx-auto px-0">
        <div className="text-center">
          <img
            className="img-fluid"
            id="Tbanner_image"
            src={ProjectImg}
            style={{ maxHeight: "100%", maxWidth: "100%" }}
            alt="Project Banner"
          />
        </div>
      </div>
      <div className="container mx-auto">
        <div className="bg-light py-4">
          <div className="flex justify-center">
            <div className="w-full md:w-10/12">
              <p id="textarea1" className="px-3 md:px-0"></p>
            </div>
          </div>
        </div>
        <div className="py-4">
          <div className="flex justify-center">
            <div className="w-full md:w-10/12">
              <div className="text-center">
                <img
                  id="t_planet_img"
                  className="img-fluid"
                  src={TPlanetMap}
                  alt="T Planet Map"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-light py-4">
        <div className="container mx-auto">
          <div className="flex justify-center">
            <div className="w-full md:w-10/12">
              <div className="card p-2 md:p-4">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="w-full md:w-5/12 text-center">
                    <img
                      id="csr_img"
                      src={CSR}
                      className="img-fluid p-3 md:p-0"
                      alt="CSR"
                    />
                  </div>
                  <div className="w-full md:w-7/12">
                    <div className="card-body">
                      <p id="textarea2" className="card-text"></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-5">
            <div className="w-full md:w-10/12">
              <div className="card p-2 md:p-4">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="w-full md:w-5/12 text-center">
                    <img
                      id="sdg_img"
                      src={SDGs}
                      className="img-fluid p-3 md:p-0"
                      alt="SDGs"
                    />
                  </div>
                  <div className="w-full md:w-7/12">
                    <div className="card-body">
                      <p id="textarea3" className="card-text"></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-5">
            <div className="w-full md:w-10/12">
              <div className="card p-2 md:p-4">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="w-full md:w-5/12 text-center">
                    <img
                      id="twins_img"
                      src={DigitalTwin}
                      className="img-fluid p-3 md:p-0"
                      alt="Digital Twin"
                    />
                  </div>
                  <div className="w-full md:w-7/12">
                    <div className="card-body">
                      <p id="textarea4" className="card-text"></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
