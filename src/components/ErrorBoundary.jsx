import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to monitoring service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="min-h-screen flex items-center justify-center p-4"
          style={{ backgroundColor: 'var(--apple-gray-1)' }}
        >
          <div 
            className="apple-card max-w-md w-full text-center"
            style={{ 
              backgroundColor: 'var(--apple-gray-2)',
              padding: 'var(--apple-space-8)'
            }}
          >
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: 'var(--apple-red)' }}
            >
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            
            <h1 
              className="apple-text-title-1 mb-4"
              style={{ color: 'var(--apple-gray-11)' }}
            >
              Oops! Something went wrong
            </h1>
            
            <p 
              className="apple-text-body mb-6"
              style={{ color: 'var(--apple-gray-6)' }}
            >
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            
            <button
              onClick={this.handleReload}
              className="apple-button apple-button-primary flex items-center space-x-2 mx-auto"
              style={{
                padding: 'var(--apple-space-3) var(--apple-space-6)',
                borderRadius: 'var(--apple-radius-medium)'
              }}
            >
              <RefreshCw className="w-5 h-5" />
              <span>Reload Page</span>
            </button>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary 
                  className="apple-text-callout cursor-pointer"
                  style={{ color: 'var(--apple-gray-7)' }}
                >
                  Error Details (Development)
                </summary>
                <pre 
                  className="mt-2 p-4 rounded-lg overflow-auto"
                  style={{ 
                    backgroundColor: 'var(--apple-gray-3)',
                    fontSize: 'var(--apple-font-size-caption)',
                    color: 'var(--apple-red)'
                  }}
                >
                  {this.state.error && this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
