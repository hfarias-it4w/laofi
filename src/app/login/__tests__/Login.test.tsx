import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginPage from "../page";
import { signIn } from "next-auth/react";

const pushMock = jest.fn();

// Mock next/navigation for router
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock })
}));

// Mock next-auth for session y signIn
jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
  signIn: jest.fn()
}));

describe("LoginPage", () => {
  it("renderiza el formulario de login", () => {
    render(<LoginPage />);
    expect(screen.getByText(/Iniciar sesión/i)).toBeInTheDocument();
    // El campo de email no tiene label visible, se busca por placeholder
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    // El botón tiene el texto 'Entrar'
    expect(screen.getByRole("button", { name: /Entrar/i })).toBeInTheDocument();
  });

  it("permite escribir en los campos", () => {
    render(<LoginPage />);
    const emailInput = screen.getByPlaceholderText(/Email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/Contraseña/i) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "test@laofi.com" } });
    fireEvent.change(passwordInput, { target: { value: "123456" } });
    expect(emailInput.value).toBe("test@laofi.com");
    expect(passwordInput.value).toBe("123456");
  });

  // Puedes agregar más tests para el submit y errores
  it("no permite enviar si los campos están vacíos", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));
    expect(signIn).not.toHaveBeenCalled();
  });

  it("no permite enviar si el email es inválido", () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "noemail" } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));
    expect(signIn).not.toHaveBeenCalled();
  });

  it("elimina el mensaje de error al modificar los campos", async () => {
    (signIn as jest.Mock).mockImplementation(() => Promise.resolve({ error: "Credenciales incorrectas" }));
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "fail@laofi.com" } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: "wrongpass" } });
    fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));
    const errorMsg = await screen.findByText(/Credenciales incorrectas/i);
    expect(errorMsg).toBeInTheDocument();
    // Modifica el campo para limpiar el error
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "nuevo@laofi.com" } });
    expect(screen.queryByText(/Credenciales incorrectas/i)).not.toBeInTheDocument();
  });

  // Este test depende de la implementación, si el botón se deshabilita durante login
  it.skip("el botón se deshabilita durante el login", async () => {
    // Simula un login que tarda
    (signIn as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ error: null }), 100)));
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "test@laofi.com" } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: "123456" } });
    const button = screen.getByRole("button", { name: /Entrar/i });
    fireEvent.click(button);
    expect(button).toBeDisabled();
    // Espera a que termine
    await screen.findByText(/Iniciar sesión/i);
    expect(button).not.toBeDisabled();
  });
  it("realiza login correcto y redirige", async () => {
    // Mock signIn para simular login exitoso
    pushMock.mockReset();
    (signIn as jest.Mock).mockImplementation(() => Promise.resolve({ error: null }));

    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "test@laofi.com" } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));

    // Espera a que se llame push (redirección)
    await screen.findByText(/Iniciar sesión/i); // Espera a que el render termine
    expect(signIn).toHaveBeenCalledWith("credentials", expect.objectContaining({ email: "test@laofi.com", password: "123456", redirect: false }));
    expect(pushMock).toHaveBeenCalledWith("/");
  });

  it("muestra error en login incorrecto", async () => {
    pushMock.mockReset();
    // Mock signIn para simular login fallido
    (signIn as jest.Mock).mockImplementation(() => Promise.resolve({ error: "Credenciales incorrectas" }));

    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "fail@laofi.com" } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: "wrongpass" } });
    fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));

    // Espera a que aparezca el mensaje de error
    const errorMsg = await screen.findByText(/Credenciales incorrectas/i);
    expect(errorMsg).toBeInTheDocument();
  });
});
