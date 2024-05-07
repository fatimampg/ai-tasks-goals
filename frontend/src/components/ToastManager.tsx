import { createRoot } from "react-dom/client";
import Toast, { ToastProps } from "./Toast";

export interface ToastOptions {
  id?: string;
  message: string;
  type: "success" | "error" | null;
  duration?: number;
}

// Manage having several toast messages (array of toast messages):
export class ToastManager {
  private containerRef: HTMLDivElement; // (only accessible within this class)
  private toasts: ToastProps[] = []; // array of toast messages
  private root: any;

  constructor() {
    const body = document.getElementsByTagName("body")[0] as HTMLBodyElement; //get body of HTML
    const toastContainer = document.createElement("div") as HTMLDivElement; //create new div for the container
    toastContainer.id = "toast-container-main"; //assign this ID to new container
    body.insertAdjacentElement("beforeend", toastContainer); //append the container to the end of the body
    this.containerRef = toastContainer;
    this.root = createRoot(this.containerRef);
  }
  public show(options: ToastOptions): void {
    const toastId = Math.random().toString(36).substring(2, 8); //generate random string with length (extract characters from index 2 to 8)
    const toast: ToastProps = {
      id: toastId,
      ...options,
      destroy: () => this.destroy(options.id ?? toastId),
    };

    this.toasts = [toast, ...this.toasts];
    this.render();
  }

  public destroy(id: string): void {
    this.toasts = this.toasts.filter((toast: ToastProps) => toast.id !== id);
    this.render();
  }

  private render(): void {
    const toastsList = this.toasts.map((toastProps: ToastProps) => (
      <Toast key={toastProps.id} {...toastProps} />
    ));
    this.root.render(toastsList);
  }
}

export const toast = new ToastManager();
