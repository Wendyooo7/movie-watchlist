import { render, screen, fireEvent } from "@testing-library/react";
import { useAuth } from "@/app/contexts/AuthContext";
import Bookmark from "@/app/film/[movieId]/Bookmark";

jest.mock("@/app/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

test("使用者未登入將無法點擊'加入片單'，並跳出操作提醒", () => {
  (useAuth as jest.Mock).mockReturnValue({ user: null }); // 模擬未登入

  render(
    <Bookmark
      movieId="123"
      title="Test Movie"
      runtime={120}
      originalTitle="Original Test Movie"
      releaseYear="2024"
    />
  );

  const bookmarkButton = screen.getByRole("img");
  const tooltip = screen.getByText("登入即可加入片單");

  expect(tooltip).toBeInTheDocument();

  fireEvent.click(bookmarkButton);
  expect(bookmarkButton).toHaveAttribute(
    "src",
    "/film/bookmark-reqular-2XL-8440F1.svg"
  ); // 確保 icon 仍是未登入狀態
});
