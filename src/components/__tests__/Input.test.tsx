import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../Input';

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="Test Label" />);
    
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('handles user input', async () => {
    const user = userEvent.setup();
    render(<Input label="Test Label" />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'test value');
    
    expect(input).toHaveValue('test value');
  });

  it('shows error message', () => {
    render(<Input label="Test Label" error="This is an error" />);
    
    expect(screen.getByText('This is an error')).toBeInTheDocument();
  });

  it('renders right element', () => {
    render(
      <Input 
        label="Test Label" 
        rightElement={<span>Right Element</span>} 
      />
    );
    
    expect(screen.getByText('Right Element')).toBeInTheDocument();
  });
}); 