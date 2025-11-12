import { useEffect, useRef, useState } from "react";
import type { FormEvent, MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ButtonGroup } from "@/components/ui/button-group";
import { Header } from "./header";
import { SignInDialog } from "./SignInDialog";
import { Plus, SendHorizontal } from "lucide-react";

const promptPrefix = "Generate";
const animatedEndings = [
  " a matte charcoal UI kit with electric blue highlights",
  " a sunlit workspace theme with warm neutrals and soft shadows",
  " an aurora gradient palette with frosted glass surfaces",
];

const Hero = ({ signInWithGoogle }: { signInWithGoogle: () => void | Promise<void> }) => {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const dialogTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [placeholderText, setPlaceholderText] = useState("");
  const [exampleIndex, setExampleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const openSignInDialog = () => {
    dialogTriggerRef.current?.click();
  };

  const handleSubmit = (event?: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();

    if (!prompt.trim()) {
      setError("Describe what you want to generate first.");
      return;
    }

    setError(null);
    openSignInDialog();
  };

  useEffect(() => {
    if (prompt) {
      setPlaceholderText("");
      return;
    }

    const currentEnding = animatedEndings[exampleIndex];
  const nextPlaceholder = `${promptPrefix}${currentEnding.slice(0, charIndex)}`;
    setPlaceholderText(nextPlaceholder);
    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (!isDeleting && charIndex < currentEnding.length) {
      timeout = setTimeout(() => setCharIndex((prev) => prev + 1), 30);
    } else if (!isDeleting && charIndex === currentEnding.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex((prev) => prev - 1), 20);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setExampleIndex((prev) => (prev + 1) % animatedEndings.length);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [prompt, exampleIndex, charIndex, isDeleting]);

  return (
    <section className="relative border-b min-h-screen border-border bg-background overflow-hidden">
      <Header signInWithGoogle={signInWithGoogle} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] py-10">
          <div className="text-center w-3xl space-y-4">
            <h1 className="text-4xl sm:text-4xl font-bold tracking-tight text-[#E5E5E5]">CompKit</h1>
            <p className="text-sm sm:text-base text-[#A1A1A1]">
              Write a prompt and get production-ready components in minutes.
            </p>

            <form onSubmit={handleSubmit} className="mx-auto w-full max-w-7xl">
              <ButtonGroup className="[--radius:1rem] mt-8 w-full justify-center transition-all duration-500">
                <ButtonGroup className="flex-1">
                  <div className="bg-card rounded-l-2xl flex items-center justify-center px-2 border-r-0 border border-border">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="p-2"
                      aria-label="Add attachment (sign in to send)"
                      onClick={(event) => {
                        event.preventDefault();
                        openSignInDialog();
                      }}
                    >
                      <Plus className="size-5" />
                    </Button>
                  </div>
                  <Input
                    className="h-12 md:h-13 px-0 bg-card placeholder:text-muted-foreground/60 text-sm"
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    placeholder={placeholderText || " "}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        handleSubmit();
                      }
                    }}
                  />
                </ButtonGroup>
                <ButtonGroup>
                  <Button
                    type="submit"
                    size="icon"
                    className="h-12 w-12 md:h-13 md:w-13"
                    aria-label="Submit prompt and sign in"
                    disabled={!prompt.trim()}
                  >
                    <SendHorizontal className="size-5" />
                  </Button>
                </ButtonGroup>
              </ButtonGroup>
            </form>

            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>
        </div>
      </div>

      <SignInDialog
        signInWithGoogle={signInWithGoogle}
        trigger={<button ref={dialogTriggerRef} type="button" className="hidden" aria-hidden="true" />}
      />
    </section>
  );
};

export { Hero };