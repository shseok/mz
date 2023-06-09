import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from '~/pages/Home';
import Error from '~/pages/Error';
import Register from '~/pages/Register';
import Login from '~/pages/Login';
import Search from '~/pages/Search';
import BookMarks from '~/pages/BookMarks';
import Setting from '~/pages/Setting';
import TabLayout from '~/components/layout/TabLayout';
import WriteIntro from '~/pages/write/WriteIntro';
import WriteLink from '~/pages/write/WriteLink';
import Write from '~/pages/Write';
import styled from 'styled-components';
import { DialogProvider } from './context/DialogContext';
import Items from './pages/Items';
import GlobalBottomSheetModal from './components/system/GlobalBottomSheetModal';
import Edit from './pages/write/Edit';
import BookmarkIntro from './pages/bookmark/BookmarkIntro';
import SettingIndex from './pages/setting/index';
import Account from './pages/setting/Account';
import { getMyAccountWithRefresh } from './lib/protectRoute';

const StyledTabLayout = styled(TabLayout)`
  padding: 16px 16px 16px 16px;
  // background: black;
`;

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <StyledTabLayout>
        <Home />
      </StyledTabLayout>
    ),
    errorElement: <Error />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/write',
    element: <Write />,
    children: [
      {
        path: '/write',
        element: <WriteLink />,
      },
      {
        path: '/write/intro',
        element: <WriteIntro />,
      },
      {
        path: '/write/link',
        element: <WriteLink />,
      },
      {
        path: '/write/edit',
        element: <Edit />,
      },
    ],
  },
  {
    path: '/bookmarks',
    element: <BookMarks />,
    children: [
      {
        path: '/bookmarks',
        element: <BookmarkIntro />,
      },
      {
        path: '/bookmarks/intro',
        element: <BookmarkIntro />,
      },
    ],
  },
  {
    path: '/items/:itemId',
    element: <Items />,
  },
  {
    path: '/search',
    element: <Search />,
  },
  {
    path: '/setting',
    element: <Setting />,
    children: [
      {
        path: '/setting',
        element: <SettingIndex />,
      },
      {
        path: '/setting/account',
        element: <Account />,
      },
    ],
  },
  // {
  //   path: '/error',
  //   element: <NetworkError />,
  // },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 5,
    },
  },
});

function App() {
  return (
    <div className='app'>
      <QueryClientProvider client={queryClient}>
        <DialogProvider>
          <RouterProvider router={router} />
        </DialogProvider>
        <GlobalBottomSheetModal />
      </QueryClientProvider>
    </div>
  );
}

export default App;
