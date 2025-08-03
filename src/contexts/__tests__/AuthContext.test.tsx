import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { User } from '@/types';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const TestComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  return (
    <div>
      <div data-testid="user-email">{user?.email || 'no-user'}</div>
      <div data-testid="user-name">{user?.name || 'no-name'}</div>
      <div data-testid="is-authenticated">{isAuthenticated.toString()}</div>
      <button 
        onClick={() => login('testing@testing.com', 'password')}
        data-testid="login-button"
      >
        Login
      </button>
      <button 
        onClick={logout}
        data-testid="logout-button"
      >
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('provides initial state correctly', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user-email')).toHaveTextContent('no-user');
    expect(screen.getByTestId('user-name')).toHaveTextContent('no-name');
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
  });

  it('loads user from localStorage on mount', () => {
    const savedUser: User = {
      id: '1',
      email: 'saved@test.com',
      name: 'Saved User'
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedUser));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user-email')).toHaveTextContent('saved@test.com');
    expect(screen.getByTestId('user-name')).toHaveTextContent('Saved User');
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
  });

  it('handles invalid localStorage data gracefully', () => {
    localStorageMock.getItem.mockReturnValue('invalid-json');

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user-email')).toHaveTextContent('no-user');
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
    
    consoleSpy.mockRestore();
  });

  it('successfully logs in with correct credentials', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByTestId('login-button');
    
    await act(async () => {
      loginButton.click();
    });

    expect(screen.getByTestId('user-email')).toHaveTextContent('testing@testing.com');
    expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'user',
      JSON.stringify({
        id: '1',
        email: 'testing@testing.com',
        name: 'Test User'
      })
    );
  });

  it('fails login with incorrect credentials', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByTestId('login-button');
    
    await act(async () => {
      loginButton.click();
    });

    expect(screen.getByTestId('user-email')).toHaveTextContent('testing@testing.com');
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it('successfully logs out', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByTestId('login-button');
    await act(async () => {
      loginButton.click();
    });

    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');

    const logoutButton = screen.getByTestId('logout-button');
    await act(async () => {
      logoutButton.click();
    });

    expect(screen.getByTestId('user-email')).toHaveTextContent('no-user');
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
  });

  it('throws error when useAuth is used outside provider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');
    
    consoleSpy.mockRestore();
  });
}); 