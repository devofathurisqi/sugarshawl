import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
export function render(url: string) { return renderToString(<MemoryRouter initialEntries={[url]}><App /></MemoryRouter>); }
