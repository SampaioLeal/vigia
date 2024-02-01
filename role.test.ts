import { assertEquals } from "https://deno.land/std@0.214.0/assert/mod.ts";
import { Role } from "./role.ts";

Deno.test("Role", () => {
  const userRole = new Role();

  assertEquals(userRole.can("make", "coffee"), false);
  assertEquals(userRole.cannot("make", "coffee"), true);

  userRole.buildPermissions([
    ["can", "make", "coffee"],
    ["cannot", "make", "sandwich"],
  ]);

  assertEquals(userRole.can("make", "coffee"), true);
  assertEquals(userRole.cannot("make", "coffee"), false);
  assertEquals(userRole.can("make", "cake"), false);
  assertEquals(userRole.cannot("make", "cake"), true);
  assertEquals(userRole.can("make", "sandwich"), false);
  assertEquals(userRole.cannot("make", "sandwich"), true);
});
