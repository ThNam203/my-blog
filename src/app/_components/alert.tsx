import Container from "@/app/_components/container";

type Props = {
    textPrefix: string;
    linkLabel: string;
    websiteUrl: string;
};

const Alert = ({ textPrefix, linkLabel, websiteUrl }: Props) => {
    return (
        <div className="border-b dark:bg-slate-800 bg-neutral-800 border-neutral-800 text-white">
            <Container>
                <div className="py-2 text-center text-sm">
                    <>
                        {textPrefix}{" "}
                        <a
                            href={websiteUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="underline hover:text-blue-600 duration-200 transition-colors"
                        >
                            {linkLabel}
                        </a>
                        .
                    </>
                </div>
            </Container>
        </div>
    );
};

export default Alert;
