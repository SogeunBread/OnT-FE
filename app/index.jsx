import { Redirect } from "expo-router";

export default function Index() {
  const isLoggedIn = false;
  const isTrainer = false;

  // 로그인 라우트가 연결되기 전까지 비로그인 사용자는 user 탭으로 보냄
  const entry = !isLoggedIn
    ? "/(userTabs)/home"
    : isTrainer
    ? "/(trainerTabs)/home"
    : "/(userTabs)/home";

  return <Redirect href={entry} />;
}
