import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { getWeightMeta } from "../../utils/sdgs/Weight";

const GenerateSdgsModal = ({ weight }) => {
  const [weights, setWeights] = useState(new Array(27).fill(0));
  const [weightData, setWeightData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const WEIGHTS = ["SDGs", "CommunityDevelopment", "FiveWaysofLife"];
  const [show, setShow] = useState(false);

  const fetchSDGsData = async () => {
    setIsLoading(true);
    try {
      const weightDetails = [];
      let globalIdCounter = 1;

      for (const weight of WEIGHTS) {
        const data = await getWeightMeta(weight);
        const categories = data.content.categories.map((category) => {
          return {
            ...category,
            id: globalIdCounter++,
            thumbnail: category.thumbnail.replace(
              "/static/imgs",
              "/src/assets"
            ),
          };
        });

        weightDetails.push(...categories);
      }

      setWeightData(weightDetails);
    } catch (error) {
      console.error("Error fetching SDGs data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!weight) {
      setWeights(new Array(27).fill(0));
    } else {
      setWeights(weight);
    }

    fetchSDGsData();
  }, [weight]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <p></p>
      <div className="sdgs-container d-flex flex-wrap" id={`icon_container`}>
        <div className="d-block">
          <Button
            id="icon_btn"
            className="btn-light btn-outline-dark rounded-0 participation-margin mt-md-0 mr-3 d-flex justify-content-center align-items-center w-20 h-20 cursor-pointer"
            onClick={handleShow}
          >
            +
          </Button>
        </div>
        <div id="icon_container" style={{ display: "inline-block" }}></div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>新增 SDGs 指標</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="flex-wrap">
            {weights.map((w, index) => {
              if (w === 0 && weightData[index]) {
                const iconInfo = weightData[index];
                return (
                  <button
                    key={index}
                    className="flex items-center gap-3 w-full border-1 mt-2 h-20 rounded-md"
                  >
                    <div
                      key={index}
                      className="w-[60px] h-[60px] ml-3 flex-shrink-0 "
                    >
                      <img
                        className="w-full h-full object-contain"
                        src={iconInfo.thumbnail}
                        alt={`Icon ${index + 1}`}
                      />
                    </div>
                    <p className="m-0">{iconInfo.title}</p>
                  </button>
                );
              }
              return null;
            })}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default GenerateSdgsModal;
