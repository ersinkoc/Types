import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Home } from '@/pages/Home';
import { Docs } from '@/pages/Docs';
import { API } from '@/pages/API';
import { Examples } from '@/pages/Examples';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/api" element={<API />} />
          <Route path="/examples" element={<Examples />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
