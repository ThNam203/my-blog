import { type PostAddress } from "@/interfaces/post";

type Props = {
    addresses: PostAddress[];
};

export function PostAddress({ addresses }: Props) {
    return (
        <div className="space-y-2">
            {addresses.map((address) => (
                <div
                    key={`${address.name}-${address.address}`}
                    className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                >
                    <svg
                        className="mt-0.5 shrink-0 w-4 h-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                    </svg>
                    <div>
                        {address.link ? (
                            <a
                                href={address.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-gray-800 dark:text-gray-200 hover:underline"
                            >
                                {address.name}
                            </a>
                        ) : (
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                                {address.name}
                            </span>
                        )}
                        <span className="mx-1">·</span>
                        {address.addressLink ? (
                            <a
                                href={address.addressLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                            >
                                {address.address}
                            </a>
                        ) : (
                            <span>{address.address}</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
