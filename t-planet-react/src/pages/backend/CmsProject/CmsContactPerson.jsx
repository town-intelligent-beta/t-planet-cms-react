import { useState, useEffect } from "react";
import "../../progress_bar.css";
import { useParams } from "react-router-dom";
import {
  handlePreview,
  handlePrevious,
  handleNextPage,
  handleSave,
} from "../../../utils/CmsAgent";
import { Row, Col, Form } from "react-bootstrap";
import PlaceMarker from "../../../assets/place_marker.svg";
import { plan_info } from "../../../utils/Plan";

const CmsContactPerson = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    hoster: "",
    org: "",
    email: "",
    tel: "",
    locations: {
      location_1: false,
      location_2: false,
      location_3: false,
      location_4: false,
      location_5: false,
    },
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      locations: {
        ...prev.locations,
        [id]: checked,
      },
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await plan_info(id);

      handleInputChange("hoster", data.hoster);
      handleInputChange("org", data.org);
      handleInputChange("email", data.email);
      handleInputChange("tel", data.tel);

      // 處理 location 的數據
      const locationArray = JSON.parse(data.location);
      const locations = {
        location_1: locationArray[0] === 1,
        location_2: locationArray[1] === 1,
        location_3: locationArray[2] === 1,
        location_4: locationArray[3] === 1,
        location_5: locationArray[4] === 1,
      };
      setFormData((prev) => ({
        ...prev,
        locations,
      }));
    };
    fetchData();
  }, [id]);

  if (!id) return null;

  return (
    <div className="container pt-3">
      <ul className="progressbar">
        <li className="active done">
          <span>計畫基本資料</span>
        </li>
        <li className="active done">
          <span>SDGs 指標設定</span>
        </li>
        <li className="active done">
          <span>社會影響力展現</span>
        </li>
        <li className="active">
          <span>專案聯繫窗口</span>
        </li>
        <li>
          <span></span>
        </li>
      </ul>

      <section>
        <div className="container pt-5">
          <form id="weight_container">
            <div className="row mt-5 pt-5 align-items-center justify-content-center">
              <div className="col-10 px-0">
                <p className="bg-nav px-3 p-2">選擇計劃總指標</p>
              </div>
              <Row className="justify-content-center">
                <Col xs={10}>
                  <Form className="bg-white p-3 border">
                    <Form.Group className="mb-3">
                      <Form.Label>專案負責人</Form.Label>
                      <Form.Control
                        type="text"
                        id="hoster"
                        placeholder="請輸入負責人姓名"
                        maxLength={20}
                        value={formData.hoster}
                        onChange={(e) =>
                          handleInputChange("hoster", e.target.value)
                        }
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>公司名稱</Form.Label>
                      <Form.Control
                        type="text"
                        id="org"
                        placeholder="請輸入公司名稱"
                        maxLength={100}
                        value={formData.org}
                        onChange={(e) =>
                          handleInputChange("org", e.target.value)
                        }
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        id="email"
                        placeholder="請輸入 Email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>聯絡電話</Form.Label>
                      <Form.Control
                        type="tel"
                        id="tel"
                        placeholder="請輸入連絡電話"
                        maxLength={20}
                        value={formData.tel}
                        onChange={(e) =>
                          handleInputChange("tel", e.target.value)
                        }
                      />
                    </Form.Group>
                  </Form>
                </Col>
              </Row>

              <div className="row mt-5 align-items-center justify-content-center">
                <div className="col-10 px-0">
                  <p className="bg-nav px-3 p-2 flex">
                    選擇地點{" "}
                    <img className="ms-2 w-5" src={PlaceMarker} alt="" />
                  </p>
                </div>
              </div>
              <Row className="justify-content-center mt-4">
                <Col xs={10}>
                  <Form className="bg-white p-3 border">
                    <Row>
                      {[
                        "T-PLANET @ 台北",
                        "T-PLANET @ 竹山",
                        "T-PLANET @ 高雄",
                        "T-PLANET @ 花蓮",
                        "T-PLANET @ 馬祖",
                      ].map((location, index) => (
                        <Col md={4} key={index}>
                          <Form.Group className="mb-3 d-flex align-items-center text-lg">
                            <Form.Check.Input
                              type="checkbox"
                              id={`location_${index + 1}`}
                              className="me-2"
                              checked={
                                formData.locations[`location_${index + 1}`]
                              }
                              onChange={handleCheckboxChange}
                            />
                            <Form.Check.Label htmlFor={`location_${index + 1}`}>
                              {`${index + 1}. ${location}`}
                            </Form.Check.Label>
                          </Form.Group>
                        </Col>
                      ))}
                    </Row>
                  </Form>
                </Col>
              </Row>
            </div>

            {/* 按鈕 */}
            <div className="row mt-5 mb-5 pb-3 justify-content-center">
              <div className="col-md-8 mt-5">
                <div className="flex flex-col md:flex-row justify-between space-y-3 md:space-y-0 md:space-x-3">
                  <button
                    type="submit"
                    id="btn_cms_plan_preview"
                    className="btn btn-secondary rounded-pill w-full md:w-1/5"
                    onClick={(event) => handlePreview(event, formData, id)}
                  >
                    檢視
                  </button>
                  <button
                    type="submit"
                    id="btn_cms_plan_preview"
                    className="btn btn-dark rounded-pill w-full md:w-1/5"
                    onClick={(event) => handlePrevious(event, id)}
                  >
                    上一步
                  </button>
                  <button
                    type="submit"
                    id="btn_ab_project_next"
                    className="btn btn-dark rounded-pill w-full md:w-1/5"
                    onClick={(event) => handleNextPage(event, formData, id)}
                  >
                    完成
                  </button>
                  <button
                    type="submit"
                    id="btn_cms_plan_save"
                    className="btn btn-success rounded-pill w-full md:w-1/5"
                    onClick={(event) => handleSave(event, formData, id)}
                  >
                    儲存草稿
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default CmsContactPerson;
