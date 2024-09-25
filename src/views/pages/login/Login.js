import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ApiUrl from '../../../api/index.jsx'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

const Login = () => {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const txt_userid = e.target.txt_userid.value;
    const txt_password = e.target.txt_password.value;

    const body = {
      "p_username_login": txt_userid,
      "p_password_login": txt_password
    };

    console.log(JSON.stringify(body));
    try {
      const response = await fetch('http://168.168.10.12:2805/api/login/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      console.log(data);
      setLoading(false);
      if (data.notification_response === "Berhasil Login") {
        // Store token and user data in localStorage
        localStorage.setItem('token', data.token);
        // console.log('Token stored:', data.token);  // Log the token

        if (data.data && data.data.length > 0) {
            localStorage.setItem('user_data', JSON.stringify(data.data[0])); // Storing the first user object
            // console.log('User data stored:', data.data[0]);  // Log the user data
        }
        Swal.fire({
          background: '#212631',
          confirmButtonColor: '#6261cc',
          color: 'white',
          icon: 'success',
          title: data.notification_response
        }).then(() => {
          window.location.href = '/dashboard';
        });
      } else{
        Swal.fire({
          background: '#212631',
          confirmButtonColor: '#6261cc',
          color: 'white',
          icon: 'error',
          title: 'Login Gagal!',
          text: data.notification_response,
        });
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      Swal.fire({
        background: '#212631',
        confirmButtonColor: '#6261cc',
        color: 'white',
        icon: 'error',
        title: 'Login Gagal!',
        text: 'Gagal Terkoneksi!',
      });
    }
  };

  return (

    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
        {loading && (
            <div
              className="loader"
              style={{
                display: 'block',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.801)',
                zIndex: 9999,
              }}
            >
              <div
                className="lds-dual-ring"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '3rem',
                }}
              ></div>
              <div
                className="text-center"
                style={{
                  position: 'absolute',
                  top: '60%',
                  left: '50%',
                  transform: 'translate(-50%, 0%)',
                  color: '#a5a5a5',
                }}
              >
                <b>Loading...</b>
              </div>
              <style>
                {`
                  .lds-dual-ring {
                    display: inline-block;
                    width: 80px;
                    height: 80px;
                  }
                  .lds-dual-ring:after {
                    content: " ";
                    display: block;
                    width: 64px;
                    height: 64px;
                    margin: 8px;
                    border-radius: 50%;
                    border: 6px solid #fff;
                    border-color: #fff transparent #fff transparent;
                    animation: lds-dual-ring 1.2s linear infinite;
                  }
                  @keyframes lds-dual-ring {
                    0% {
                      transform: rotate(0deg);
                    }
                    100% {
                      transform: rotate(360deg);
                    }
                  }
                `}
              </style>
            </div>
          )}
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput placeholder="Username" name="txt_userid" autoComplete="username" />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        name="txt_password"
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" type="submit" className="px-4">
                          Login
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Retiel</h2>
                    <p>
                      Gacor kang.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
