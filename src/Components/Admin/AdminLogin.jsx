import React, { useState } from "react";
import axios from "axios";


function AdminLogin() {

  const [REmail, setREmail] = useState("");
  const [RPassword, setRPassword] = useState("");
  const adminLogin = async () => {
    try {
      const config = {
        url: "admin/adminLogin",
        method: "post",
        baseURL: `${process.env.REACT_APP_API_URL}/api/`,
        headers: { "content-type": "application/json" },
        data: { REmail: REmail, RPassword: RPassword }
      }
      let res = await axios(config);
      if (res.status === 200) {
        alert("Successfully login");
        window.sessionStorage.setItem("admin", JSON.stringify(res.data.success))
        window.location.assign("/dashboard")
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error);
      } else {
        alert("Something went wrong. Please try again.");
      }
    }
  }
  return (
    <>
    <div className="bg-img">
      <div className="add" >
        <div className="container">

          <div className="fw_90">
            <div className="add_0">
              <div className="im09">
                <div className="d-flex" >
                  <a href="/" className="tail-text">
                    <img src="../Assets/logo.png" alt="Logo" className="admin-login-logo" />
                  </a>

                </div>
              </div>
              <div className="add-90">
                <form>
                  <div className="sd_00 mb-2">
                    <label>Email</label> <br />
                    <input
                      type="email"
                      placeholder="email@gmail.com"
                      className="name_0"
                      value={REmail}
                      onChange={(e) => setREmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="sd_00 mb-2">
                    <label>Password</label>
                    <br />
                    <input
                      type="password"
                      placeholder="password"
                      className="name_0"
                      value={RPassword}
                      onChange={(e) => setRPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="sd_00 mt-2">

                    {" "}
                    <button type="button" style={{ background: "white", color: "black" }}
                      onClick={() => adminLogin()}
                    >Login</button>

                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default AdminLogin;
