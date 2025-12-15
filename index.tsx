import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("React Error Boundary Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding: 20, textAlign: 'center', direction: 'rtl', fontFamily: 'sans-serif'}}>
          <h2 style={{color: '#ef4444', marginBottom: 10}}>عذراً، حدث خطأ غير متوقع</h2>
          <p style={{color: '#374151', marginBottom: 20}}>قد تكون هناك مشكلة في البيانات المحفوظة أو الاتصال.</p>
          
          <div style={{background: '#f3f4f6', padding: 15, borderRadius: 8, textAlign: 'left', direction: 'ltr', overflow: 'auto', maxHeight: 200, marginBottom: 20, fontSize: '0.85rem'}}>
            {this.state.error?.toString()}
          </div>

          <button 
            onClick={() => { 
              localStorage.clear(); 
              window.location.reload(); 
            }} 
            style={{
              padding: '10px 20px', 
              backgroundColor: '#ef4444', 
              color: 'white', 
              border: 'none', 
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
            مسح البيانات وإعادة التشغيل (إصلاح المشكلة)
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);