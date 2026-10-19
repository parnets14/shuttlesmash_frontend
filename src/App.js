import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "react-multi-carousel/lib/styles.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import Header from "./Components/Header";
import Home from "./Components/Home";
import Footer from "./Components/Footer";
import Overview from "./Components/Overview";
import KeyHighlights from "./Components/KeyHighlights";
import LeadershipTeam from "./Components/LeadershipTeam";
import Events from "./Components/Events";
import Results from "./Components/Results";
import Ranking from "./Components/Ranking";
import RankingDetail from "./Components/RankingDetail";
import Gallery from "./Components/Gallery";
import Podcast from "./Components/Podcast";
import Contactus from "./Components/Contactus";

import Dashboard from "./Components/Admin/Dashboard";

import Main from "./Components/Admin/Main";
import AdminBanner from "./Components/Admin/AdminBanner";
import AdminPartners from "./Components/Admin/AdminPartners";
import Testimonials from "./Components/Admin/Testimonials";
import AdminOverview from "./Components/Admin/AdminOverview";
import AdminKeyhighlight from "./Components/Admin/AdminKeyhighlight";
import AdminEvents from "./Components/Admin/AdminEvents";
import AdminGallery from "./Components/Admin/AdminGallery";
import AdminContactus from "./Components/Admin/AdminContactus";
import GeneralEnquiry from "./Components/Admin/GeneralEnquiry";
import RegistrationList from "./Components/Admin/RegistrationList";
import AdminLogin from "./Components/Admin/AdminLogin";
import AdminDoubleResult from "./Components/Admin/AdminDoubleResult";
import AdminSingleResult from "./Components/Admin/AdminSingleResult";
import AdminCategory from "./Components/Admin/AdminCategory";
import AdminAchivers from "./Components/Admin/AdminAchivers";
import AdminTeamMember from "./Components/Admin/AdminTeamMember";
import AdminLeadershipTeam from "./Components/Admin/AdminLeadershipTeam";
import Registration from "./Components/Registration";
import PaymentSuccess from "./Components/PaymentSuccess";
import PrivacyPolicy from "./Components/PrivacyPolicy";
import TermsAndConditions from "./Components/TermsAndConditions";
import RefundPolicy from "./Components/RefundPolicy";
import ShippingPolicy from "./Components/ShippingPolicy";
import ReturnPolicy from "./Components/ReturnPolicy";
import AdminEventHeroBanner from "./Components/Admin/AdminEventHeroBanner";
import AdminEventInfo from "./Components/Admin/AdminEventInfo";
import AdminRanking from "./Components/Admin/AdminRanking";
import AdminPodcast from "./Components/Admin/AdminPodcast";
import AdminPodcastHeroBanner from "./Components/Admin/AdminPodcastHeroBanner";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header />
                <Home />
                <Footer />
              </>
            }
          />

          <Route
            path="/overview"
            element={
              <>
                <Header />
                <Overview />
                <Footer />
              </>
            }
          />

          <Route
            path="/keyhighlights"
            element={
              <>
                <Header />
                <KeyHighlights />
                <Footer />
              </>
            }
          />

          <Route
            path="/leadershipteam"
            element={
              <>
                <Header />
                <LeadershipTeam />
                <Footer />
              </>
            }
          />

          <Route
            path="/events"
            element={
              <>
                <Header />
                <Events />
                <Footer />
              </>
            }
          />
          <Route
            path="/registration"
            element={
              <>
                <Header />
                <Registration />
                <Footer />
              </>
            }
          />

          <Route
            path="/Paymentsuccess"
            element={
              <>
                <Header />
                <PaymentSuccess />
                <Footer />
              </>
            }
          />

          <Route
            path="/results"
            element={
              <>
                <Header />
                <Results />
                <Footer />
              </>
            }
          />

          <Route path="/ranking" element={<><Header /><Ranking /><Footer /></>} />
          <Route path="/ranking/:groupId" element={<><Header /><RankingDetail /><Footer /></>} />
          <Route path="/ranking/:year/:category" element={<><Header /><RankingDetail /><Footer /></>} />

          <Route
            path="/gallery"
            element={
              <>
                <Header />
                <Gallery />
                <Footer />
              </>
            }
          />

          <Route
            path="/podcast"
            element={
              <>
                <Header />
                <Podcast />
                <Footer />
              </>
            }
          />

          <Route
            path="/contactus"
            element={
              <>
                <Header />
                <Contactus />
                <Footer />
              </>
            }
          />

          <Route
            path="/privacy-policy"
            element={
              <>
                <Header />
                <PrivacyPolicy />
                <Footer />
              </>
            }
          />

          <Route
            path="/terms-and-conditions"
            element={
              <>
                <Header />
                <TermsAndConditions />
                <Footer />
              </>
            }
          />

          <Route
            path="/refund-policy"
            element={
              <>
                <Header />
                <RefundPolicy />
                <Footer />
              </>
            }
          />

          <Route
            path="/shipping-policy"
            element={
              <>
                <Header />
                <ShippingPolicy />
                <Footer />
              </>
            }
          />

          <Route
            path="/return-policy"
            element={
              <>
                <Header />
                <ReturnPolicy />
                <Footer />
              </>
            }
          />

          {/* Admin panel  */}
          <Route
            path="/admin"
            element={
              <>
                <AdminLogin />
              </>
            }
          />
          <Route
            path="/dashboard"
            element={
              <Main
                children={
                  <>
                    <Dashboard />
                  </>
                }
              />
            }
          />
          <Route
            path="/admin_banner"
            element={
              <Main
                children={
                  <>
                    <AdminBanner />
                  </>
                }
              />
            }
          />
          <Route
            path="/admin_partners"
            element={
              <Main
                children={
                  <>
                    <AdminPartners />
                  </>
                }
              />
            }
          />
          <Route
            path="/admin_testimonial"
            element={
              <Main
                children={
                  <>
                    <Testimonials />
                  </>
                }
              />
            }
          />
          <Route
            path="/admin_overview"
            element={
              <Main
                children={
                  <>
                    <AdminOverview />
                  </>
                }
              />
            }
          />
          <Route
            path="/admin_keyhighlight"
            element={
              <Main
                children={
                  <>
                    <AdminKeyhighlight />
                  </>
                }
              />
            }
          />
          <Route
            path="/admin_category"
            element={
              <Main
                children={
                  <>
                    <AdminCategory />
                  </>
                }
              />
            }
          />
          <Route
            path="/admin_eventinfo"
            element={
              <Main children={<><AdminEventInfo /></>} />
            }
          />
          <Route
            path="/admin_events"
            element={
              <Main
                children={
                  <>
                    <AdminEvents />
                  </>
                }
              />
            }
          />

          <Route
            path="/admin_singleresults"
            element={
              <Main
                children={
                  <>
                    <AdminSingleResult />
                  </>
                }
              />
            }
          />

          <Route
            path="/admin_doubleresults"
            element={
              <Main
                children={
                  <>
                    <AdminDoubleResult />
                  </>
                }
              />
            }
          />

          <Route
            path="/admin_achivers"
            element={
              <Main
                children={
                  <>
                    <AdminAchivers />
                  </>
                }
              />
            }
          />

          <Route
            path="/admin_gallery"
            element={
              <Main
                children={
                  <>
                    <AdminGallery />
                  </>
                }
              />
            }
          />

          <Route
            path="/admin_contactus"
            element={
              <Main
                children={
                  <>
                    <AdminContactus />
                  </>
                }
              />
            }
          />
          <Route
            path="/registration-list"
            element={
              <Main
                children={
                  <>
                    <RegistrationList />
                  </>
                }
              />
            }
          />
          <Route
            path="/general_enquiry"
            element={
              <Main children={<><GeneralEnquiry /></>} />
            }
          />

          <Route
            path="/admin_teammember"
            element={
              <Main children={<><AdminTeamMember /></>} />
            }
          />
          <Route
            path="/admin_leadershipteam"
            element={
              <Main children={<><AdminLeadershipTeam /></>} />
            }
          />
          <Route path="/admin_ranking"
            element={<Main children={<><AdminRanking /></>} />} />

          <Route path="/admin_podcast"
            element={<Main children={<><AdminPodcast /></>} />} />

          <Route path="/admin_podcast_banner"
            element={<Main children={<><AdminPodcastHeroBanner /></>} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;


// process.env.REACT_APP_API_URL/api/
