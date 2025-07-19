import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import BlogForm from '../components/BlogForm';
import userEvent from '@testing-library/user-event';
import 'regenerator-runtime/runtime';

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup();
  const postSubmission = jest.fn();
  const { container } = render(<BlogForm postSubmission={postSubmission} />);

  const inputTitle = container.querySelector('#blog-title');
  const inputAuthor = container.querySelector('#blog-author');
  const inputUrl = container.querySelector('#blog-url');

  const saveButton = screen.getByText('Create');

  await user.type(inputTitle, 'test title new');
  await user.type(inputAuthor, 'test author new');
  await user.type(inputUrl, 'test url new');

  await user.click(saveButton);

  expect(postSubmission.mock.calls).toHaveLength(1);
  expect(postSubmission.mock.calls[0][0]).toStrictEqual({
    title: 'test title new',
    author: 'test author new',
    url: 'test url new',
  });
});