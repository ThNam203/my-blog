import Container from "@/app/_components/container";

const Alert = () => {
  return (
    <div
      className="border-b dark:bg-slate-800 bg-neutral-800 border-neutral-800 text-white"
    >
      <Container>
        <div className="py-2 text-center text-sm">
          <>
              This is my blog. You also want to check out my{" "}
              <a
                href="https://letslive.work"
                target="_blank"
                className="underline hover:text-blue-600 duration-200 transition-colors"
              >
                Let's Live website.
              </a>
              .
            </>
        </div>
      </Container>
    </div>
  );
};

export default Alert;
