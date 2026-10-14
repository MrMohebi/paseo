import { describe, expect, it } from "vitest";
import { registerRotatedPushToken } from "./token-registration";

describe("push token rotation", () => {
  it("registers the replacement before revoking the cached token", async () => {
    const operations: string[] = [];
    const client = {
      isConnected: true,
      registerPushToken: (token: string) => {
        operations.push(`register:${token}`);
      },
      unregisterPushToken: async (token: string) => {
        operations.push(`revoke:${token}`);
      },
    };
    await registerRotatedPushToken({
      client,
      token: "new",
      previousToken: "old",
      supportsRevocation: true,
    });
    expect(operations).toEqual(["register:new", "revoke:old"]);
  });
  it("retains the subscription across reconnects and supports older daemons", async () => {
    const operations: string[] = [];
    const client = {
      isConnected: true,
      registerPushToken: (token: string) => {
        operations.push(token);
      },
      unregisterPushToken: async () => {
        throw new Error("Unexpected revocation");
      },
    };
    await registerRotatedPushToken({
      client,
      token: "same",
      previousToken: "same",
      supportsRevocation: true,
    });
    await registerRotatedPushToken({
      client,
      token: "new",
      previousToken: "same",
      supportsRevocation: false,
    });
    expect(operations).toEqual(["same", "new"]);
  });
  it("does not register disconnected clients and revokes denied permissions", async () => {
    const revoked: string[] = [];
    const client = {
      isConnected: false,
      registerPushToken: () => {
        throw new Error("Unexpected registration");
      },
      unregisterPushToken: async (token: string) => {
        revoked.push(token);
      },
    };
    await registerRotatedPushToken({
      client,
      token: "token",
      previousToken: "old",
      supportsRevocation: true,
    });
    expect(revoked).toEqual([]);
    client.isConnected = true;
    await registerRotatedPushToken({
      client,
      token: null,
      previousToken: "old",
      supportsRevocation: true,
    });
    expect(revoked).toEqual(["old"]);
  });
});
