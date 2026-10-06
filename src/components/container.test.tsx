import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { Container } from './container';

describe('<Container />', () => {
  test('renders its content', () => {
    render(
      <Container>
        <div data-testid="container-content" />
      </Container>
    );

    expect(screen.getByTestId('container-content')).toBeInTheDocument();
  });
});
