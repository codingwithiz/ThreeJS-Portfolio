import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Its own lazy chunk (see Work.jsx), so a case study's heading never waits on the parser.
const Markdown = ({ children }) => <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>;

export default Markdown;
