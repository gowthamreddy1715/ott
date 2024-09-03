import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
  Navigate,
  Link,
  useNavigate
} from "react-router-dom";



import "./App.css";
import { useContext,useEffect } from "react";
import SuccessMessage from "./components/SuccessMessage";
import { AuthContext } from "./context/authContext";
import Register from "./components/Register";
import AddProfile from "./components/AddProfile";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile"; // Import EditProfile component here
import Login from "./components/Login";
import LandingPage from "./components/LandingPage";
import ForgotPassword from "./components/ForgotPassword";
import VerifyOtp from "./components/VerifyOtp";
import PasswordReset from "./components/PasswordReset";
import HoverPlayer from "./components/HoverPlayer";
import HoverPlayer1 from "./components/HoverPlayer1";
import RealmLogo from "./components/RealmLogo";
import FileUpload from "./components/FileUpload";
import EditAuth from "./components/EditAuth";
import Restrict from "./components/Restrict";
import Home from "./components/Home";
import Movie from "./components/Movie";
import Search from "./components/Search";
import PinPage from "./components/PinPage";
import VideoPlayer from "./components/VideoPlayer";
import WatchlistVideos from "./components/WatchlistVideos";
import ChildWatchlistVideos from "./components/ChildWatchlistVideos";
import Movies from "./components/Movies";
import GenrePage from "./components/GenrePage";
import Admin from "./components/Admin";
import ChildHome from "./components/ChildHome";
import ChildMovies from "./components/ChildMovies";
import ChildSearch from "./components/ChildSearch";
import Test from "./components/Test";
import Plan1 from "./components/Plan1";
import Plan2 from "./components/Plan2";
import Plan3 from "./components/Plan3";
import Plan4 from "./components/Plan4";
import Plans from "./components/Plans";
import PaymentPage from "./components/PaymentPage";
import ChildPlan1 from "./components/ChildPlan1";
import ChildPlan2 from "./components/ChildPlan2";
import ChildPlan3 from "./components/ChildPlan3";
import ChildPlan4 from "./components/ChildPlan4";
import ChildPlans from "./components/ChildPlans";
import ChildSuccessMessage from "./components/ChildSuccessMessage";
import ChildPayment from "./components/ChildPayment";
import ChildMovie from "./components/ChildMovie";
import ChildHoverVideo from "./components/ChildHoverVideo";
import ChildHoverplayer from "./components/ChildHoverplayer";
import LoginWithOtp from "./components/LoginWithOtp";


function App() {
  const { currentUser } = useContext(AuthContext);

  const Layout = () => {
    return (
      <div className="light">
        <div>
          <Outlet />
        </div>
      </div>
    );
  };
  

  

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  const RedirectIfLoggedIn = ({ children }) => {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
  
    useEffect(() => {
      if (currentUser) {
        // Check if the user's email is "uploader@gmail.com"
        if (currentUser.email === "uploader@gmail.com") {
          // Redirect to the admin page if the user is logged in and trying to access login
          navigate('/admin');
        } else {
          // Redirect to the home page for other users
          navigate('/home');
        }
      }
    }, [currentUser, navigate]);
  
    return children; // Render the children (login page) when the user is not logged in
  };
  
  



  const router = createBrowserRouter([
    {
      path: "/login",
      element: (
        <RedirectIfLoggedIn>
          <Login />
        </RedirectIfLoggedIn>
      ),
    },
    {
      path: "/test",
      element: <Test />,
    },
    {
      path: "/loginwithotp",
      element: <LoginWithOtp />,
    },

    {
      path: '/pin/:profileId/',
      element: <PinPage />,
    },
    {
      path: "/register",
      element: (
        <RedirectIfLoggedIn>
          <Register />
        </RedirectIfLoggedIn>
      ),
    },
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/realmlogo",
      element: <RealmLogo />,
    },
   
    {
      path: "/forgotpassword",
      element: (
        <RedirectIfLoggedIn>
          <ForgotPassword />
        </RedirectIfLoggedIn>
      ),
    },



    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/profiles",
          element: <Profile />,
        },
        {
          path: "/hoverplayer",
          element: <HoverPlayer />,
        },
        {
          path: "/hoverPlayer1",
          element: <HoverPlayer1 />,
        },

        
        {
          path: "/ChildHoverVideo",
          element: <ChildHoverVideo />,
        },

        {
          path: "/watchlist",
          element: <WatchlistVideos />,
        },
        {
          path: "/Childwatchlist",
          element: <ChildWatchlistVideos />,
        },

        {
          path: "/success",
          element: <SuccessMessage />,
        },


        {
          path: "/Home",
          element: <Home/>,
        },
        {
          path: "/plans",
          element: <Plans />,
        },
        {
          path: "/plan1",
          element: <Plan1 />,
        },
        {
          path: "/plan2",
          element: <Plan2 />,
        },
        {
          path: "/plan3",
          element: <Plan3 />,
        },
        {
          path: "/plan4",
          element: <Plan4 />,
        },
        {
          path: "/pay/:price",
          element: <PaymentPage />,
        },
        
        
        
       
        
       
        {
          path: "/VerifyOtp",
          element: <VerifyOtp />, // Include EditProfile component for editing profiles
        },
        

        {
          path: "/PasswordReset",
          element: (
            <RedirectIfLoggedIn>
              <PasswordReset />
            </RedirectIfLoggedIn>
          ),
        },
        {
          path: "/Moviespage",
          element: <Movies />, // Include EditProfile component for editing profiles
        },
    
        {
          path: "/movie/:id",
          element: <Movie />, // Include EditProfile component for editing profiles
        },
        {
          path: "/upload",
          element: <FileUpload />,
        },
        {
          path: "/search",
          element: <Search />,
        },
        {
          path: "/genre/:genreId",
          element: <GenrePage />, // Include EditProfile component for editing profiles
        },
        {
          path: "/ChildHome",
          element: <ChildHome/>,
        },
        {
          path: "/ChildPlans",
          element: <ChildPlans/>,
        },
        
        {
          path: "/Childplan1",
          element: <ChildPlan1/>,
        },
       
        {
          path: "/Childplan2",
          element: <ChildPlan2/>,
        },
        {
          path: "/Childplan3",
          element: <ChildPlan3/>,
        },
        {
          path: "/Childplan4",
          element: <ChildPlan4/>,
        },
        {
          path: "/ChildSuccessMessage",
          element: <ChildSuccessMessage/>,
        },
        {
          path: "/ChildPayment/:price",
          element: <ChildPayment/>,
        },
        {
          path: "/childmovie/:id",
          element: <ChildMovie/>,
        },
    

        {
          path: "/add-profile",
          element: <AddProfile />,
        },
        {
          path: "/restrict",
          element: <Restrict />,
        },
        {
          path: "/admin",
          element: <Admin />,
        },
        {
          path: "/edit-profile/:profileId",
          element: <EditProfile />, // Include EditProfile component for editing profiles
        },
        {
          path: "/Childhome/:profileId",
          element: <ChildHome/>,
        },
        {
          path: "/edit-auth/:profileId",
          element: <EditAuth />,
        },
        {
          path: "/ChildMovies",
          element: <ChildMovies/>,
        },
        {
          path: "/hoverplayer1",
          element: <ChildHoverplayer/>,
        },
        {
          path: "/ChildSearch",
          element: <ChildSearch/>,
        },
        {
          path: "/video/:videoPath",
          element: <VideoPlayer />, 
        },
        
      ],
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
