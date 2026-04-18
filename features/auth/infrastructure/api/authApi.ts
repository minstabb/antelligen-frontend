import { env } from "@/infrastructure/config/env";
import type { OAuthProvider } from "@/features/auth/domain/intent/authIntent";
import type { AuthMeResponse } from "@/features/auth/domain/model/authMeResponse";

function getProviderPath(provider: OAuthProvider): string {
  const pathMap: Record<OAuthProvider, string> = {
    kakao: env.kakaoLoginPath,
    google: "/oauth2/authorization/google",
    naver: "/oauth2/authorization/naver",
    meta: "/oauth2/authorization/meta",
  };
  return pathMap[provider];
}

export function redirectOAuthLogin(provider: OAuthProvider): void {
  window.location.href = env.apiBaseUrl + getProviderPath(provider);
}

export async function fetchAuthMe(): Promise<AuthMeResponse> {
  const response = await fetch(`${env.apiBaseUrl}/authentication/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`/authentication/me 요청 실패: ${response.status}`);
  }

  return response.json() as Promise<AuthMeResponse>;
}
