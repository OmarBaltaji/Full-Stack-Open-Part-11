import Reach from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Blog from '../components/Blog';
import userEvent from '@testing-library/user-event';
import 'regenerator-runtime/runtime';

describe('<Blog />', () => {
  test('renders content', () => {
    const onLikeClicked = jest.fn();
    const onDeleteBlog = jest.fn();
    const user = { id: 1, username: 'test', name: 'test' };
    const blog = {
      title: 'test title',
      author: 'random author',
      url: 'https://randomurl.com',
      likes: 0,
      user: user
    };

    const { container } = render(<Blog blog={blog} onLikeClicked={onLikeClicked} onDeleteBlog={onDeleteBlog} user={user} />);

    const element = container.querySelector('.blog');
    expect(element).toBeDefined();

    expect(element).toHaveTextContent(`${blog.title} ${blog.author}`);
    expect(element).not.toHaveTextContent(`${blog.url} ${blog.likes}`);
  });

  test('after clicking the button, url and likes show', async () => {
    const onLikeClicked = jest.fn();
    const onDeleteBlog = jest.fn();
    const user = { id: 1, username: 'test', name: 'test' };
    const blog = {
      title: 'test title',
      author: 'random author',
      url: 'https://randomurl.com',
      likes: 0,
      user: user
    };

    const { container } = render(<Blog blog={blog} onLikeClicked={onLikeClicked} onDeleteBlog={onDeleteBlog} user={user} />);

    const userEventInstance = userEvent.setup();
    const button = screen.getByText('View');
    await userEventInstance.click(button);

    const element = container.querySelector('.blog');
    expect(element).toHaveTextContent(`${blog.url}${blog.likes}`);
  });

  test('after clicking like button twice, event handler called twice', async () => {
    const onLikeClicked = jest.fn();
    const onDeleteBlog = jest.fn();
    const user = { id: 1, username: 'test', name: 'test' };
    const blog = {
      title: 'test title',
      author: 'random author',
      url: 'https://randomurl.com',
      likes: 0,
      user: user
    };

    render(<Blog blog={blog} onLikeClicked={onLikeClicked} onDeleteBlog={onDeleteBlog} user={user} />);

    const userEventInstance = userEvent.setup();

    const viewBtn = screen.getByText('View');
    await userEventInstance.click(viewBtn);

    const likeBtn = screen.getByText('like');
    await userEventInstance.click(likeBtn);
    await userEventInstance.click(likeBtn);

    expect(onLikeClicked.mock.calls).toHaveLength(2);
  })
});