import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SplashScreen from './SplashScreenFolder/SplashScreen';
import SignUpScreen from './SignUpFolder/SignUpScreen';
import HomeScreen from './HomeScreenFolder/HomeScreen';
import SignInScreen from './SignInFolder/SignInScreen';
import PictureUploadingScreen from './PictureUploadingFolder/PictureUploadingScreen';
import AddressQuestionsScreen from './AddressQuestionsFolder/AddressQuestionsScreen';
import ProfessionDetailsScreen from './ProfessionDetailsFolder/ProfessionDetailsScreen';
import WorkExperienceScreen from './WorkExperienceFolder/WorkExperienceScreen';

// create a single QueryClient for the app
const queryClient = new QueryClient(
{
  defaultOptions:
  {
    queries:
    {
      // tune these as needed:
      staleTime: 5 * 60 * 1000, // 5 minutes fresh
      cacheTime: 15 * 60 * 1000, // keep cached for 15 minutes
      retry: false,
    },
  },
});

function App()
{
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/SignUpPath" element={<SignUpScreen />} />
          <Route path="/SignInPath" element={<SignInScreen />} />
          <Route path="/HomeScreenPath" element={<HomeScreen />} />
          <Route path="/PictureUploadingPath" element={<PictureUploadingScreen />} />
          <Route path="/AddressQuestionsPath" element={<AddressQuestionsScreen/>}/>
          <Route path="/ProfessionDetailsPath" element={<ProfessionDetailsScreen/>} />
          <Route path="/WorkExperienceDetailsPath" element={<WorkExperienceScreen/>}/>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
export default App;