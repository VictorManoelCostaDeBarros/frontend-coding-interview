import { render } from '@testing-library/react';
import { Logo } from '../Logo';

describe('Logo', () => {
  it('renders the logo correctly', () => {
    const { container } = render(<Logo />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('applies custom className', () => {
    const { container } = render(<Logo className="custom-class" />);
    
    const logoDiv = container.firstChild as HTMLElement;
    expect(logoDiv?.className).toContain('custom-class');
  });
}); 