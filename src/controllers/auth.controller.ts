import { Request, Response } from "express";
import { z } from "zod";
import * as authService from "../services/auth.service";

const authSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function register(req: Request, res: Response): Promise<void> {
  const parsed = authSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    const user = await authService.register(
      parsed.data.email,
      parsed.data.password
    );
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error: any) {
    res.status(409).json({ error: error.message });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = authSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    const { token } = await authService.login(
      parsed.data.email,
      parsed.data.password
    );
    res.status(200).json({ token });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
}

export function logout(_req: Request, res: Response): void {
  // Stateless JWT : l'invalidation est gérée côté client
  // Pour une blacklist serveur, stocker le JTI dans Redis ici
  res.status(200).json({ message: "Logged out successfully" });
}
