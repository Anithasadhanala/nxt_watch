https://nxtdp.ccbp.tech/

#################################  index.js


import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter} from 'react-router-dom'

import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
)



################################################  App.js


import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'
import Home from './components/Home'
import Gaming from './components/Gaming'
import Login from './components/Login'
import Trending from './components/Trending'
import VideoItemDetails from './components/VideoItemDetails'
import SavedVideos from './components/SavedVideos'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

const App = () => (
  <>
    <BrowserRouter>
      <Switch>
        <Route exact path="/login" component={Login} />
        <ProtectedRoute exact path="/" component={Home} />
        <ProtectedRoute exact path="/trending" component={Trending} />
        <ProtectedRoute exact path="/videos/:id" component={VideoItemDetails} />
        <ProtectedRoute exact path="/saved-videos" component={SavedVideos} />
        <ProtectedRoute exact path="/gaming" component={Gaming} />
        <Route exact path="/not-found" component={NotFound} />
        <Redirect to="not-found" />
      </Switch>
    </BrowserRouter>
  </>
)

export default App

######################################################   App.css

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}



###################################################   components/GameItem

import './index.css'

const GameItem = props => {
  const {details} = props
  const {thumbNail, title, viewCount} = details
  return (
    <div className="GamesItemContainer">
      <img src={thumbNail} alt="video thumbnail" className="GamesItemImg" />
      <div className="GamesItemSubCont">
        <h1 className="GamersItemHead">{title}</h1>
        <p className="GameItemPara">{viewCount} Watching Worldwide</p>
      </div>
    </div>
  )
}
export default GameItem



* {
  margin: 0px;
  box-sizing: border-box;
}

.GamesItemContainer {
  display: flex;
  flex-direction: column;
  height: 340px;
  width: 230px;
  margin-bottom: 30px;
  margin-right: 50px;
  border: 0px;
  border-radius: 100px;
}
.GamesItemImg {
  height: 240px;
  width: 240px;
}
.GamesItemSubCont {
  display: flex;
  flex-direction: column;
  background-color: white;

  padding: 20px;
  height: 80px;

  width: 240px;
}
.GamersItemHead {
  font-size: 16px;
  color: #475569;
  font-weight: 600;
  font-family: Roboto;
  margin-bottom: 8px;
}
.GameItemPara {
  font-size: 14px;
  color: #94a3b8;
  font-weight: 500;
  font-family: Roboto;
}



#################################################        components/Gaming


import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {SiYoutubegaming} from 'react-icons/si'
import GameItem from '../GameItem'
import Header from '../Header'
import SideBar from '../SideBar'
import './index.css'

class Gaming extends Component {
  state = {
    gamingList: [],
    status: 'Loading',
  }

  componentDidMount = () => {
    this.gamingItemsApiCalled()
  }

  onSuccessFetchApi = data => {
    const cleanedData = data.map(each => ({
      id: each.id,
      title: each.title,
      thumbNail: each.thumbnail_url,
      viewCount: each.view_count,
    }))
    console.log(cleanedData[0])
    this.setState({gamingList: cleanedData, status: 'Success'})
  }

  onFailureFetchApi = () => {
    this.setState({status: 'Failure'})
  }

  gamingItemsApiCalled = async () => {
    this.setState({status: 'Loading'})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/videos/gaming'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)

    const data = await response.json()

    if (response.ok) {
      this.onSuccessFetchApi(data.videos)
    } else {
      this.onFailureFetchApi()
    }
  }

  isLoadingFunctionCalled = () => (
    <div className="loader-container hi" data-testid="loader">
      <Loader type="ThreeDots" color="#0f0f0f" height="50" width="50" />
    </div>
  )

  retryBtnCliked = () => {
    this.gamingItemsApiCalled()
  }

  isFailureFunctionCalled = () => {
    console.log('qqqqqqqqqqqq')
    return (
      <div className="SthWrongContainer">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png"
          alt=""
          className="sthWrongImg"
        />
        <h1 className="sthWrongHead">Oops! Something Went Wrong</h1>
        <p className="sthWrongPara">
          We are having some trouble to complete your request. Please try again.
        </p>
        <div>
          <button
            className="sthWrongBtn"
            type="button"
            onClick={this.retryBtnCliked}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  isSuccessfulFunctionCalled = () => {
    const {gamingList} = this.state
    return (
      <>
        <div className="trendingNav" data-testid="gaming">
          <SiYoutubegaming className="trendingImg" />
          <h1 className="trendingHead">Gaming</h1>
        </div>
        <div className="gamingSingleContainer">
          {gamingList.map(each => (
            <GameItem key={each.id} details={each} />
          ))}
        </div>
      </>
    )
  }

  switchCaseFunctionCalled = () => {
    const {status} = this.state
    switch (status) {
      case 'Loading':
        return this.isLoadingFunctionCalled()
      case 'Success':
        return this.isSuccessfulFunctionCalled()
      case 'Failure':
        return this.isFailureFunctionCalled()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="HomeBody">
          <SideBar details="Gaming" />
          <div className="HomeBodySubContainer">
            <div className="trendingContainer">
              {this.switchCaseFunctionCalled()}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Gaming



.gamingSingleContainer {
  background-color: #f9f9f9;
  width: 80vw;
  display: flex;
  flex-wrap: wrap;
  margin-top: 40px;
}
.trendingImg {
  height: 30px;
  width: 30px;
  margin-right: 20px;
  color: red;
}



#########################################################       components/Header


import {Link, withRouter} from 'react-router-dom'
import {FaMoon} from 'react-icons/fa'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'
import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const logoutBtnClicked = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="navBar">
      <div className="nav-logo">
        <Link to="/" data-testid="home">
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
            alt="website logo"
            className="nav-logoImg"
          />
        </Link>
      </div>
      <div className="nav-subContainer">
        <ul className="unordered">
          <li>
            <button className="nav-cont-btn" type="button" data-testid="theme">
              <FaMoon className="nav-cont-img" />
            </button>
          </li>
          <li>
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-watch-profile-img.png "
              alt="profile"
              className="nav-cont-img"
            />
          </li>

          <div className=" popup-container">
            <Popup
              modal
              trigger={
                <button type="button" className="trigger-button logoutBtn">
                  Logout
                </button>
              }
            >
              {close => (
                <div className="cont">
                  <div className="">
                    <p className="popoutPara">
                      Are you sure, you want to logout?
                    </p>
                  </div>
                  <button
                    type="button"
                    className=" popoutBtn closeBtn"
                    onClick={() => close()}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className=" popoutBtn confirmBtn"
                    onClick={logoutBtnClicked}
                  >
                    Confirm
                  </button>
                </div>
              )}
            </Popup>
          </div>
        </ul>
      </div>
    </nav>
  )
}
export default withRouter(Header)




* {
  margin: 0px;
  box-sizing: border-box;
}
.lo {
  border: 0px;
  background-color: transparent;
}
.cont {
  height: 25vh;
  width: 45vw;
  padding: 30px;
}
.unordered {
  list-style-type: none;
  display: flex;
}
.popoutPara {
  font-size: 25px;
  color: #475569;
  font-weight: 500;
  font-family: Roboto;
  margin-bottom: 40px;
}
.closeBtn {
  border: #e2e8f0 2px solid;
}
.confirmBtn {
  background-color: #4f46e5;
  color: white;
  border: 0px;
}
.popoutBtn {
  height: 40px;
  width: 90px;
  border-radius: 5px;
  margin-right: 20px;
}
.navBar {
  background-color: white;
  height: 8vh;
  padding: 30px;
  padding-left: 30px;
  padding-right: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.nav-cont-btn {
  border: none;
  background-color: transparent;
}
.nav-logoImg {
  height: 35px;
  width: 120px;
  margin-bottom: 10px;
}
.nav-subContainer {
  display: flex;
}
.nav-cont-img {
  height: 30px;
  width: 30px;
  margin-left: 20px;
}
.logoutBtn {
  background-color: white;
  color: #4f46e5;
  font-size: 12px;
  font-family: Roboto;
  border: #4f46e5 2px solid;
  border-radius: 8px;
  margin-left: 20px;
  height: 34px;
  width: 90px;
}







###################################################  components/Home


import {Component} from 'react'
import Cookies from 'js-cookie'
import {BiSearch} from 'react-icons/bi'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Premium from '../Premium'
import SearchItem from '../SearchItem'
import SideBar from '../SideBar'
import './index.css'

class Home extends Component {
  state = {search: '', homeList: [], status: 'Loading', premium: true}

  searchInputChanged = event => {
    this.setState({search: event.target.value})
  }

  componentDidMount = () => {
    this.homeGetApiCalled()
  }

  onFailureHomeApi = () => {
    this.setState({status: 'Failure'})
  }

  onSuccessHomeApi = data => {
    const cleanedData = data.map(each => ({
      id: each.id,
      title: each.title,
      name: each.channel.name,
      publish: each.published_at,
      viewCount: each.view_count,
      thumbNail: each.thumbnail_url,
      profileImg: each.channel.profile_image_url,
    }))

    this.setState({homeList: cleanedData, status: 'Success'})
  }

  homeGetApiCalled = async () => {
    this.setState({status: 'Loading'})

    const {search} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/videos/all?search=${search}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      this.onSuccessHomeApi(data.videos)
    } else {
      this.onFailureHomeApi()
    }
  }

  retryBtnCliked = () => {
    this.homeGetApiCalled()
  }

  searchBtnClicked = () => {
    this.homeGetApiCalled()
  }

  isLoadingFunctionCalled = () => (
    <div className="loader-container hi" data-testid="loader">
      <Loader type="ThreeDots" color="#0f0f0f" height="50" width="50" />
    </div>
  )

  isFailureFunctionCalled = () => (
    <div className="SthWrongContainer">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png"
        alt=""
        className="sthWrongImg"
      />
      <h1 className="sthWrongHead">Oops! Something Went Wrong</h1>
      <p className="sthWrongPara">
        We are having some trouble to complete your request. Please try again.
      </p>
      <div>
        <button
          className="sthWrongBtn"
          type="button"
          onClick={this.retryBtnCliked}
        >
          Retry
        </button>
      </div>
    </div>
  )

  isSuccessfulFunctionCalled = () => {
    const {homeList} = this.state
    const listLength = homeList.length

    return (
      <>
        {listLength === 0 ? (
          <div className="SthWrongContainer">
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-search-results-img.png "
              alt="no videos"
              className="sthWrongImg"
            />
            <h1 className="sthWrongHead">No Search results found</h1>
            <p className="sthWrongPara">
              Try different key words or remove search filter.
            </p>
            <div>
              <button
                className="sthWrongBtn"
                type="button"
                onClick={this.retryBtnCliked}
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <ul className="unordered searchItemContainer">
            {homeList.map(each => (
              <SearchItem key={each.id} details={each} />
            ))}
          </ul>
        )}
      </>
    )
  }

  premiumClicked = () => {
    this.setState({premium: false})
  }

  isKeyEntered = event => {
    if (event.code === 'Enter') this.homeGetApiCalled()
  }

  switchCaseFunctionCalled = () => {
    const {status} = this.state
    switch (status) {
      case 'Loading':
        return this.isLoadingFunctionCalled()
      case 'Success':
        return this.isSuccessfulFunctionCalled()
      case 'Failure':
        return this.isFailureFunctionCalled()
      default:
        return null
    }
  }

  render() {
    const {premium} = this.state
    return (
      <>
        <Header />
        <div className="HomeBody">
          <SideBar details="Home" />
          <div className="HomeBodySubContainer">
            {premium ? (
              <Premium
                premiumClicked={this.premiumClicked}
                data-testid="banner"
              />
            ) : null}

            <div className="HomeBodySubContainer2">
              <div className="HomeSearchContainer">
                <input
                  type="search"
                  placeholder="Search"
                  className="searchInput"
                  onChange={this.searchInputChanged}
                  onKeyDown={this.isKeyEntered}
                />
                <button
                  className="searchBtn"
                  type="button"
                  onClick={this.searchBtnClicked}
                  data-testid="searchButton"
                >
                  <BiSearch />
                </button>
              </div>

              {this.switchCaseFunctionCalled()}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Home





* {
  margin: 0px;
  box-sizing: border-box;
}
.HomeBody {
  display: flex;
}
.hi {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  height: 60vh;
}
.HomeBodySubContainer {
  display: flex;
  flex-direction: column;

  height: 92vh;
  overflow-y: auto;
}
.searchItemContainer {
  margin-left: 0px;
  margin-top: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  min-height: 55vh;
}
.HomeSearchContainer {
  margin-left: 18px;
  display: flex;
}

.searchInput {
  height: 40px;
  width: 500px;
  border: #94a3b8 1px solid;
  padding: 15px;
  border-radius: 5px;
}
.searchBtn {
  height: 40px;
  width: 80px;
  border: #94a3b8 1px solid;
  border-radius: 2px;
  border-left: none;
}
.searchInputImg {
  height: 18px;
  width: 18px;
}
.HomeBodySubContainer2 {
  background-color: #f8fafc;

  width: 68vw;
  padding-top: 30px;
  min-height: 90vh;
}
* {
  margin: 0px;
  box-sizing: border-box;
}
.SthWrongContainer {
  min-height: 60vh;
  min-width: 82vw;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.sthWrongImg {
  height: 200px;
  width: 280px;
  margin-bottom: 40px;
}
.sthWrongHead {
  font-size: 28px;
  font-family: Roboto;
  font-weight: 600;
  color: #0f0f0f;
  margin-bottom: 10px;
}

.sthWrongPara {
  font-size: 18px;
  font-family: Roboto;
  font-weight: 500;
  color: #475569;
  margin-bottom: 10px;
}
.sthWrongBtn {
  height: 34px;
  width: 90px;
  background-color: #3b82f6;
  border: none;
  border-radius: 4px;
}








############################################         components/Login



import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    errStatus: '',
    errMsg: '',
    check: false,
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  onSubmitFailure = data => {
    this.setState({errStatus: true, errMsg: data})
  }

  loginAPICallPost = async () => {
    const url = 'https://apis.ccbp.in/login'

    const {username, password} = this.state
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  formSubmitted = event => {
    event.preventDefault()
    this.loginAPICallPost()
  }

  checkBoxChecked = () => {
    this.setState(prevState => ({check: !prevState.check}))
  }

  usernameChanged = event => {
    this.setState({username: event.target.value})
  }

  passwordChanged = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {username, password, errMsg, errStatus, check} = this.state
    const type = check ? 'text' : 'password'
    return (
      <div className="login-bgContainer">
        <div className="login-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
            alt="logo"
            className="login-logo"
          />
          <form className="login-form" onSubmit={this.formSubmitted}>
            <div className="login-form-div">
              <label className="login-label" htmlFor="username">
                USERNAME
              </label>
              <br />
              <input
                type="text"
                id="username"
                placeholder="Username"
                className="input-login"
                onChange={this.usernameChanged}
                value={username}
              />
            </div>
            <div className="login-form-div">
              <label className="login-label" htmlFor="password">
                PASSWORD
              </label>
              <br />
              <input
                type={type}
                id="password"
                placeholder="Password"
                className="input-login"
                onChange={this.passwordChanged}
                value={password}
              />
            </div>
            <div className="login-showPassword">
              <input
                className="checkbox-password"
                type="checkbox"
                id="password-checkbox"
                onChange={this.checkBoxChecked}
              />
              <label className="showPassword-label" htmlFor="password-checkbox">
                Show Password
              </label>
            </div>
            <div>
              <button className="login-submitBtn" type="submit">
                Login
              </button>
            </div>
            {errStatus ? <p className="loginMsg">{errMsg}</p> : <></>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login




* {
  margin: 0px;
  box-sizing: border-box;
}
.login-bgContainer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f1f5f9;
}
.loginMsg {
  font-family: Roboto;
  font-weight: 500;
  font-size: 14px;
  color: red;
  margin-top: 8px;
}
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 60%;
  width: 30%;
  background-color: #f9f9f9;
  box-shadow: 2px 2px 3px 3px #e2e8f0;
  border-radius: 8px;
}
.login-logo {
  height: 70px;
  width: 200px;
  margin-bottom: 30px;
}
.login-label {
  font-family: Roboto;
  font-weight: 500;
  font-size: 15px;
  color: #64748b;
  margin-bottom: 95px;
}
.input-login {
  height: 60px;
  min-width: 380px;
  border: #e2e8f0 1px solid;
  border-radius: 10px;
  margin-top: 10px;
  margin-bottom: 20px;
  padding: 20px;
}
.login-showPassword {
  display: flex;
}
.showPassword-label {
  font-family: Roboto;
  font-weight: 500;
  font-size: 16px;
  color: #231f20;
  margin-left: 6px;
}
.login-submitBtn {
  height: 58px;
  width: 380px;
  background-color: #3b82f6;
  font-family: Roboto;
  font-weight: 500;
  font-size: 15px;
  color: white;
  border: 0px;
  border-radius: 10px;
  margin-top: 20px;
}




########################################3     components/ NotFound



import Header from '../Header'
import SideBar from '../SideBar'
import './index.css'

const NotFound = () => (
  <>
    <Header />
    <div className="HomeBody">
      <SideBar />
      <div className="HomeBodySubContainer">
        <div className="notFoundContainer">
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-watch-not-found-light-theme-img.png"
            alt="not found"
            className="notFoundIMg"
          />
          <h1 className="notFoundHead">Page Not Found</h1>
          <p className="notFoundPara">
            We are sorry, the page you requested could not be found.
          </p>
        </div>
      </div>
    </div>
  </>
)
export default NotFound



* {
  margin: 0px;
  box-sizing: border-box;
}
.notFoundContainer {
  background-color: #f9f9f9;
  width: 86vw;
  height: 92vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.notFoundIMg {
  height: 400px;
  height: 400px;
  margin-bottom: 30px;
}
.notFoundHead {
  font-size: 25px;
  color: #0f0f0f;
  font-weight: 600;
  font-family: Roboto;
  margin-bottom: 20px;
}
.notFoundPara {
  font-size: 18px;
  color: #475569;
  font-weight: 500;
  font-family: Roboto;
}




##########################################      components/Premium


import {FiX} from 'react-icons/fi'
import './index.css'

const Premium = props => {
  const {premiumClicked} = props

  const crossBtnPremiumClicked = () => {
    premiumClicked()
  }
  return (
    <div className="bannerBgContainer" data-testid="banner">
      <div className="bannerNav">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
          alt="logo"
          className="bannerLogo"
        />
        <div>
          <button
            className="bannerCross"
            type="button"
            data-testid="close"
            onClick={crossBtnPremiumClicked}
          >
            <FiX className="bannerCrossImg" />
          </button>
        </div>
      </div>
      <p className="bannerPara">Buy Nxt Watch Premium prepaid plans with UPI</p>
      <button className="bannerBtn" type="button">
        GET IT NOW
      </button>
    </div>
  )
}
export default Premium


* {
  margin: 0px;
  box-sizing: border-box;
}
.bannerBgContainer {
  width: 85vw;
  height: 35vh;
  margin: 20px;
  background-image: url('https://assets.ccbp.in/frontend/react-js/nxt-watch-banner-bg.png');
  background-size: cover;

  padding-right: 100px;
  padding-top: 20px;
}
.bannerNav {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
}
.bannerCross {
  border: none;
  background-color: transparent;
}
.bannerCrossImg {
  height: 30px;
  width: 30px;
}
.bannerLogo {
  height: 38px;
  width: 180px;
}
.bannerPara {
  font-size: 20px;
  color: #1e293b;
  font-weight: 4s00;
  font-family: Roboto;
}
.bannerBtn {
  font-size: 15px;
  color: #475569;
  font-weight: 500;
  font-family: Roboto;
  background-color: transparent;
  border: #475569 2px solid;
  height: 50px;
  width: 150px;
  margin-top: 30px;
}



##################################################   components/ProtectedRoute


import Cookies from 'js-cookie'
import {Redirect, Route} from 'react-router-dom'
import './index.css'

const ProtectedRoute = props => {
  const jwtToken = Cookies.get('jwt_token')

  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }
  return <Route {...props} />
}

export default ProtectedRoute




###############################################   components/SavedVidoes


import {AiFillFire} from 'react-icons/ai'
import SingleItem from '../SingleItem'
import Header from '../Header'
import SideBar from '../SideBar'
import './index.css'

const SavedVideos = () => (
  <>
    <Header />
    <div className="HomeBody">
      <SideBar details="Saved" />
      <div className="HomeBodySubContainer">
        {true ? (
          <div className="notFoundContainer">
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-saved-videos-img.png"
              alt="no saved videos"
              className="notFoundIMg"
            />
            <h1 className="notFoundHead">No saved videos found</h1>
            <p className="notFoundPara">
              You can save your videos while watching them.
            </p>
          </div>
        ) : (
          <div className="trendingContainer" data-testid="savedVideos">
            <div className="trendingNav">
              <AiFillFire className="trendingImg" />
              <h1 className="trendingHead">Saved Videos</h1>
            </div>
            <div className="trendingSingleContainer">
              <SingleItem />
              <SingleItem />
              <SingleItem />
              <SingleItem />
              <SingleItem />
              <SingleItem />
              <SingleItem />
              <SingleItem />
            </div>
          </div>
        )}
      </div>
    </div>
  </>
)

export default SavedVideos


#############################################3       components/SearchItem



import {Link} from 'react-router-dom'
import {formatDistanceToNow} from 'date-fns'
import './index.css'

const SearchItem = props => {
  const {details} = props
  const {title, thumbNail, viewCount, name, publish, profileImg, id} = details
  const path = `/videos/${id}`

  const date = formatDistanceToNow(new Date(publish)).slice(-8)
  return (
    <Link to={path} className="linked">
      <li className="searchItemContainer2">
        <img src={thumbNail} alt="video thumbnail" className="searchItemImg" />
        <div className="searchItemSubContainer">
          <img src={profileImg} alt="channel logo" className="searchItemImg2" />
          <div className="SearchItemDetails">
            <p className="searchItemPara">{title}</p>
            <p className="searchItem2">{name}</p>
            <div className="searchItemInfoCont">
              <p className="searchItemViews">{viewCount} views</p>
              <p className="dot">.</p>
              <p className="searchItemTime"> {date} ago</p>
            </div>
          </div>
        </div>
      </li>
    </Link>
  )
}
export default SearchItem



* {
  margin: 0px;
  box-sizing: border-box;
}
.searchItemContainer2 {
  height: 400px;
  width: 360px;
  display: flex;
  flex-direction: column;
  margin-right: 20px;
  margin-bottom: 20px;
}

.searchItemImg {
  height: 250px;
  width: 360px;
}
.searchItemImg2 {
  height: 50px;
  width: 45px;
}
.linked {
  text-decoration: none;
}
.searchItemSubContainer {
  display: flex;
  background-color: white;

  padding: 20px;
  width: 360px;
  height: 230px;
}
.SearchItemDetails {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  height: 280px;
}

.searchItemPara {
  font-family: Roboto;
  font-weight: 400;
  font-size: 16px;
  color: #1e293b;
  margin-bottom: 20px;
}
.searchItem2 {
  font-family: Roboto;
  font-weight: 500;
  font-size: 16px;
  color: #475569;
  margin-bottom: 15px;
}
.searchItemInfoCont {
  display: flex;
}
.searchItemViews {
  font-family: Roboto;
  font-weight: 500;
  font-size: 16px;
  color: #475569;
}

.dot {
  font-family: Roboto;
  font-weight: 500;
  font-size: 16px;
  color: #475569;
  margin-left: 6px;
  margin-right: 6px;
}
.searchItemTime {
  font-family: Roboto;
  font-weight: 500;
  font-size: 16px;
  color: #475569;
}



#########################################3 components/SideBar


import {Link} from 'react-router-dom'
import {AiFillHome, AiFillFire} from 'react-icons/ai'
import {SiYoutubegaming} from 'react-icons/si'
import {MdPlaylistAdd} from 'react-icons/md'
import './index.css'

const SideBar = props => {
  const {details} = props
  let styleHome = 'sideBarTopItem'
  let styleHomeImg = 'sideBarTopImg'
  let styleGaming = 'sideBarTopItem'
  let styleGamingImg = 'sideBarTopImg '
  let styleTrending = 'sideBarTopItem'
  let styleTrendingImg = 'sideBarTopImg '
  let styleSaved = 'sideBarTopItem'
  let styleSavedImg = 'sideBarTopImg '

  if (details === 'Home') {
    styleHome = 'sideBarTopItem white'
    styleHomeImg = 'sideBarTopImg redImg'
  } else if (details === 'Gaming') {
    styleGaming = 'sideBarTopItem white'
    styleGamingImg = 'sideBarTopImg redImg '
  } else if (details === 'Trending') {
    styleTrending = 'sideBarTopItem white'
    styleTrendingImg = 'sideBarTopImg redImg'
  } else if (details === 'Saved') {
    styleSaved = 'sideBarTopItem white'
    styleSavedImg = 'sideBarTopImg redImg'
  }
  return (
    <div className="sideBar">
      <div className="sideBarTopCont">
        <Link to="/" className="linkBtn">
          <div className={styleHome}>
            <AiFillHome className={styleHomeImg} />
            <h1 className="sideBarTopContHeader">Home</h1>
          </div>
        </Link>
        <Link to="/trending" className="linkBtn">
          <div className={styleTrending}>
            <AiFillFire className={styleTrendingImg} />
            <h1 className="sideBarTopContHeader">Trending</h1>
          </div>
        </Link>
        <Link to="/gaming" className="linkBtn">
          <div className={styleGaming}>
            <SiYoutubegaming className={styleGamingImg} />
            <h1 className="sideBarTopContHeader">Gaming</h1>
          </div>
        </Link>
        <Link to="/saved-videos" className="linkBtn">
          <div className={styleSaved}>
            <MdPlaylistAdd className={styleSavedImg} />
            <h1 className="sideBarTopContHeader">Saved videos</h1>
          </div>
        </Link>
      </div>

      <div className="sideBarBottomCont">
        <p className="sideBarContact">CONTACT US</p>
        <div className="sideBarBottomContactDiv">
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-watch-facebook-logo-img.png "
            alt="facebook logo"
            className="sideBarBottomImg"
          />
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-watch-twitter-logo-img.png "
            alt="twitter logo"
            className="sideBarBottomImg"
          />
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-watch-linked-in-logo-img.png"
            alt="linked in logo"
            className="sideBarBottomImg"
          />
        </div>
        <p className="contactPara">
          Enjoy! Now to see your channels and recommendations!
        </p>
      </div>
    </div>
  )
}
export default SideBar


.sideBar {
  height: 92vh;
  width: 14vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 30px;
  padding-bottom: 30px;
  padding-left: 20px;
}
.white {
  background-color: #e2e8f0;
}
.redImg {
  color: red;
}
.sideBarTopCont {
  display: flex;
  flex-direction: column;
}
.sideBarTopItem {
  display: flex;
  align-items: center;

  height: 45px;

  padding-left: 8px;
  border-radius: 8px;
}
.sideBarTopImg {
  height: 20px;
  width: 20px;
}
.linkBtn {
  text-decoration: none;
}
.sideBarTopContHeader {
  font-size: 18px;
  color: #475569;
  font-weight: 500;
  font-family: Roboto;
  margin-left: 20px;
}
.sideBarBottomCont {
  display: flex;
  flex-direction: column;
}
.sideBarContact {
  font-size: 20px;
  color: black;
  font-weight: 600;
  font-family: Roboto;
  margin-bottom: 15px;
}
.sideBarBottomContactDiv {
  display: flex;
  margin-bottom: 20px;
}
.sideBarBottomImg {
  height: 30px;
  width: 30px;
  margin-right: 10px;
}
.contactPara {
  font-size: 16px;
  color: #475569;
  font-weight: 500;
  font-family: Roboto;
  width: 10vw;
}




#################################################33  components/SingleItem



import {formatDistanceToNow} from 'date-fns'
import './index.css'

const SingleItem = props => {
  const {details} = props

  const {title, thumbNail, viewCount, publish} = details

  const date = formatDistanceToNow(new Date(publish)).slice(-8)

  return (
    <li className="singleCardCont">
      <img src={thumbNail} alt="video thumbnail" className="singleImg" />
      <div className="singleItemSubCont">
        <h1 className="singleHead">{title}</h1>
        <p className="singlePara">iB Hubs</p>
        <div className="singleItemSub2">
          <p className="singlePara">{viewCount} views</p>
          <p className="singlePara">.</p>
          <p className="singlePara">{date} ago</p>
        </div>
      </div>
    </li>
  )
}
export default SingleItem



* {
  margin: 0px;
  box-sizing: border-box;
}
.singleCardCont {
  height: 230px;
  width: 70vw;
  background-color: #ffffff;
  display: flex;
  flex-direction: row;
  border-radius: 10px;
  margin-bottom: 35px;
}
.singleItemSubCont {
  display: flex;
  flex-direction: column;
  padding: 30px;
}
.singleHead {
  font-size: 17px;
  color: black;
  font-weight: 500;
  font-family: Roboto;
  margin-bottom: 20px;
}
.singleItemSub2 {
  display: flex;
}
.singlePara {
  font-size: 15px;
  color: #475569;
  font-weight: 500;
  font-family: Roboto;
  margin-bottom: 20px;
  margin-right: 10px;
}




####################################################    components/SthWrong


import './index.css'

const SthWrong = () => (
  <div className="SthWrongContainer">
    <img
      src="https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png"
      alt=""
      className="sthWrongImg"
    />
    <h1 className="sthWrongHead">Oops! Something Went Wrong</h1>
    <p className="sthWrongPara">
      We are having some trouble to complete your request. Please try again.
    </p>
    <div>
      <button className="sthWrongBtn" type="button" onClick="retryBtnCliked">
        Retry
      </button>
    </div>
  </div>
)

export default SthWrong


* {
  margin: 0px;
  box-sizing: border-box;
}
.SthWrongContainer {
  min-height: 60vh;
  min-width: 82vw;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.sthWrongImg {
  height: 200px;
  width: 280px;
  margin-bottom: 40px;
}
.sthWrongHead {
  font-size: 28px;
  font-family: Roboto;
  font-weight: 600;
  color: #0f0f0f;
  margin-bottom: 10px;
}

.sthWrongPara {
  font-size: 18px;
  font-family: Roboto;
  font-weight: 500;
  color: #475569;
  margin-bottom: 10px;
}
.sthWrongBtn {
  height: 34px;
  width: 90px;
  background-color: #3b82f6;
  border: none;
  border-radius: 4px;
}




##################################3          components/Trending


import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillFire} from 'react-icons/ai'
import SingleItem from '../SingleItem'
import Header from '../Header'
import SideBar from '../SideBar'
import './index.css'

class Trending extends Component {
  state = {
    trendingList: [],
    status: 'Loading',
  }

  componentDidMount = () => {
    this.trendingItemsApiCalled()
  }

  onSuccessFetchApi = data => {
    console.log(data[0])
    const cleanedData = data.map(each => ({
      id: each.id,
      title: each.title,
      thumbNail: each.thumbnail_url,
      viewCount: each.view_count,
      publish: each.published_at,
    }))
    console.log(cleanedData[0])
    this.setState({trendingList: cleanedData, status: 'Success'})
  }

  onFailureFetchApi = () => {
    console.log('failure')
    this.setState({status: 'Failure'})
  }

  trendingItemsApiCalled = async () => {
    this.setState({status: 'Loading'})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/videos/trending'
    const options = {
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    console.log(response)
    const data = await response.json()
    console.log(data)
    if (response.ok) {
      this.onSuccessFetchApi(data.videos)
    } else {
      this.onFailureFetchApi()
    }
  }

  isLoadingFunctionCalled = () => (
    <div className="loader-container hi" data-testid="loader">
      <Loader type="ThreeDots" color="#0f0f0f" height="50" width="50" />
    </div>
  )

  retryBtnCliked = () => {
    this.trendingItemsApiCalled()
  }

  isFailureFunctionCalled = () => {
    console.log('qqqqqqqqqqqq')
    return (
      <div className="SthWrongContainer">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png"
          alt=""
          className="sthWrongImg"
        />
        <h1 className="sthWrongHead">Oops! Something Went Wrong</h1>
        <p className="sthWrongPara">
          We are having some trouble to complete your request. Please try again.
        </p>
        <div>
          <button
            className="sthWrongBtn"
            type="button"
            onClick={this.retryBtnCliked}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  isSuccessfulFunctionCalled = () => {
    const {trendingList} = this.state
    console.log('success')
    return (
      <>
        <div className="trendingNav" data-testid="trending">
          <AiFillFire className="trendingImg" />
          <h1 className="trendingHead">Trending</h1>
        </div>
        <ul className="unordered">
          {trendingList.map(each => (
            <SingleItem key={each.id} details={each} />
          ))}
        </ul>
      </>
    )
  }

  switchCaseFunctionCalled = () => {
    const {status} = this.state
    switch (status) {
      case 'Loading':
        return this.isLoadingFunctionCalled()
      case 'Success':
        return this.isSuccessfulFunctionCalled()
      case 'Failure':
        return this.isFailureFunctionCalled()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="HomeBody">
          <SideBar details="Trending" />
          <div className="HomeBodySubContainer">
            <div className="trendingContainer">
              <div className="trendingSingleContainer">
                {this.switchCaseFunctionCalled()}
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Trending


* {
  margin: 0px;
  box-sizing: border-box;
}
.trendingContainer {
  background-color: #f8fafc;
  height: 92vh;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  width: 85vw;
  padding: 30px;
}
.trendingSingleContainer {
  padding: 40px;
  padding-left: 0px;
}

.trendingNav {
  display: flex;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
}
.trendingImg {
  height: 30px;
  width: 30px;
  margin-right: 20px;
  color: red;
}
.trendingHead {
  font-size: 28px;
  color: black;
  font-weight: 600;
  font-family: Roboto;
}


################################################    components/VideoItemDetails



import {Component} from 'react'
import Cookies from 'js-cookie'
import {formatDistanceToNow} from 'date-fns'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {AiFillLike, AiFillDislike} from 'react-icons/ai'
import {MdPlaylistAdd} from 'react-icons/md'
import ReactPlayer from 'react-player'
import Header from '../Header'
import SideBar from '../SideBar'
import './index.css'

class VideoItemDetails extends Component {
  state = {
    detailedData: {},
    like: false,
    unlike: false,
    save: false,
    status: 'Loading',
  }

  componentDidMount = () => {
    this.detailedVideoApiCalled()
  }

  likedBtnCliked = () => {
    this.setState(prevState => {
      if (prevState.like === false) {
        return {like: true, unlike: false}
      }
      return {like: false}
    })
  }

  unLikedBtnCliked = () => {
    this.setState(prevState => {
      if (prevState.unlike === false) {
        return {unlike: true, like: false}
      }
      return {unlike: false}
    })
  }

  savedBtnCliked = () => {
    this.setState(prevState => ({save: !prevState.save}))
  }

  onSuccessDetailedVideo = data => {
    const cleanedData = {
      id: data.id,
      title: data.title,
      videoUrl: data.video_url,
      thumNail: data.thumbnail_url,
      viewCount: data.view_count,
      publish: formatDistanceToNow(new Date(data.published_at)).slice(-8),
      description: data.description,
      name: data.channel.name,
      profile: data.channel.profile_image_url,
      subcribers: data.channel.subscriber_count,
    }

    console.log(cleanedData)
    this.setState({detailedData: cleanedData, status: 'Success'})
  }

  onFailureDetailedVideo = () => {
    this.setState({status: 'Failure'})
  }

  detailedVideoApiCalled = async () => {
    this.setState({status: 'Loading'})
    const {match} = this.props
    const {params} = match

    const {id} = params
    const url = `https://apis.ccbp.in/videos/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    const data = await response.json()

    console.log(data)
    if (response.ok) {
      this.onSuccessDetailedVideo(data.video_details)
    } else {
      this.onFailureDetailedVideo()
    }
  }

  isLoadingFunctionCalled = () => (
    <div className="loader-container hi" data-testid="loader">
      <Loader type="ThreeDots" color="#0f0f0f" height="50" width="50" />
    </div>
  )

  isFailureFunctionCalled = () => {
    console.log('qqqqqqqqqqqq')
    return (
      <div className="SthWrongContainer">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png"
          alt=""
          className="sthWrongImg"
        />
        <h1 className="sthWrongHead">Oops! Something Went Wrong</h1>
        <p className="sthWrongPara">
          We are having some trouble to complete your request. Please try again.
        </p>
        <div>
          <button
            className="sthWrongBtn"
            type="button"
            onClick={this.retryBtnCliked}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  retryBtnCliked = () => {
    this.detailedVideoApiCalled()
  }

  isSuccessfulFunctionCalled = () => {
    const {detailedData, like, unlike, save} = this.state
    const liked = like ? 'detailedViewBtn blueColor' : 'detailedViewBtn'
    const unliked = unlike ? 'detailedViewBtn blueColor' : 'detailedViewBtn'
    const saved = save ? 'detailedViewBtn blueColor' : 'detailedViewBtn'
    const likedImg = like ? 'detailedViewImg blueColor' : 'detailedViewImg'
    const unlikedImg = unlike ? 'detailedViewImg blueColor' : 'detailedViewImg'

    const savedImg = save ? 'detailedViewImg blueColor' : 'detailedViewImg'

    return (
      <div className="ji" data-testid="videoItemDetails">
        <ReactPlayer
          url={detailedData.videoUrl}
          className="video"
          alt="video thumbnail"
        />

        <p className="detailedVideoHead">{detailedData.title}</p>
        <div className="detailedViewDataContainer">
          <div className="detailedViewsDateSubContainer">
            <p className="detailedPara">{detailedData.viewCount} views</p>
            <p className="detailedPara">.</p>
            <p className="detailedPara">{detailedData.publish} ago</p>
          </div>
          <div className="detailedLikesDislikesCont">
            <AiFillLike className={likedImg} />
            <button
              type="button"
              onClick={this.likedBtnCliked}
              className={liked}
            >
              Like
            </button>

            <AiFillDislike className={unlikedImg} />
            <button
              className={unliked}
              type="button"
              onClick={this.unLikedBtnCliked}
            >
              Dislike
            </button>

            <MdPlaylistAdd className={savedImg} />
            <button
              className={saved}
              type="button"
              onClick={this.savedBtnCliked}
            >
              Save
            </button>
          </div>
        </div>
        <hr className="detailedLine" />

        <div className="detailedChannelContainer">
          <img
            src={detailedData.profile}
            alt="channel logo"
            className="detailedChannelImg"
          />
          <div className="detailedChannelSubCont">
            <p className="detailedChannelHead">{detailedData.name}</p>
            <p className="detailedSubscribersPara">
              {detailedData.subcribers} subscribers
            </p>

            <p className="detailedChannelLongPara">
              {detailedData.description}
            </p>
          </div>
        </div>
      </div>
    )
  }

  switchCaseFunctionCalled = () => {
    const {status} = this.state
    switch (status) {
      case 'Loading':
        return this.isLoadingFunctionCalled()
      case 'Success':
        return this.isSuccessfulFunctionCalled()
      case 'Failure':
        return this.isFailureFunctionCalled()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="HomeBody">
          <SideBar />
          <div className="HomeBodySubContainer">
            <div className="detailedVideoContainer">
              {this.switchCaseFunctionCalled()}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default VideoItemDetails


* {
  margin: 0px;
  box-sizing: border-box;
}
.detailedVideoContainer {
  background-color: #f9f9f9;
  height: 93vh;
  width: 80vw;
  display: flex;
  flex-direction: column;
  padding: 40px;
}
.ji {
  width: 50vw;
}
.video {
  min-width: 50vw;
  min-height: 50vh;
}
.detailedVideoHead {
  font-size: 18px;
  color: #0f0f0f;
  font-weight: 600;
  font-family: Roboto;
  margin-top: 30px;
  margin-bottom: 40px;
}
.detailedViewDataContainer {
  display: flex;
  justify-content: space-between;
}
.detailedViewsDateSubContainer {
  display: flex;
}

.detailedLikesDislikesCont {
  display: flex;
}
.detailedViewBtn {
  border: 0px;
  background-color: transparent;
  height: 35px;
  width: 90px;
  display: flex;
  margin-right: 10px;
  color: #64748b;
  font-size: 16px;

  font-weight: 500;
  font-family: Roboto;
  margin-top: 8px;
  margin-left: 6px;
}
.blueColor {
  color: #2563eb;
}
.detailedViewImg {
  height: 25px;
  width: 25px;
  margin-top: 5px;
}
.detailedViewPara {
  font-size: 16px;

  font-weight: 500;
  font-family: Roboto;
  margin-top: 8px;
  margin-left: 2px;
}
.detailedPara {
  font-size: 16px;
  color: #64748b;
  font-weight: 500;
  font-family: Roboto;
  margin-right: 10px;
}
.detailedLine {
  background-color: #475569;
  height: 2px;
  margin-top: 20px;
  margin-bottom: 30px;
}
.detailedChannelContainer {
  display: flex;
}
.detailedChannelImg {
  height: 50px;
  width: 50px;
  margin-right: 25px;
}
.detailedChannelSubCont {
  display: flex;
  flex-direction: column;
}
.detailedChannelHead {
  font-size: 18px;
  color: #1e293b;
  font-weight: 600;
  font-family: Roboto;
  margin-top: 5px;
  margin-bottom: 18px;
}
.detailedSubscribersPara {
  font-size: 16px;
  color: #64748b;
  font-weight: 400;
  font-family: Roboto;
  margin-bottom: 10px;
}

.detailedChannelLongPara {
  font-size: 16px;
  color: #475569;
  font-weight: 600;
  font-family: Roboto;
}














































