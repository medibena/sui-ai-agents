import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Flex, Heading } from "@radix-ui/themes";
import { NavLink } from "react-router-dom";

const menu = [
    {
        title: "Call",
        link: "/",
    },
    {
        title: "Agents",
        link: "/agents",
    },
    {
        title: "History",
        link: "/history",
    },
];

export function Header() {
    return (
        <>
            <Flex
                position="sticky"
                px="4"
                py="4"
                justify="between"
                style={{
                    borderBottom: "1px solid var(--border)",
                    backgroundColor: "var(--card-bg)",
                    marginBottom: "2rem"
                }}
            >
                <Box>
                    <Heading size="6" style={{ color: "var(--accent)" }}>Sui AI Agents</Heading>
                </Box>

                <Box className="flex gap-8 items-center">
                    {menu.map((item) => (
                        <NavLink
                            key={item.link}
                            to={item.link}
                            className={({ isActive, isPending }) =>
                                `cursor-pointer flex items-center gap-2 text-lg font-medium transition-colors ${
                                    isPending ? "text-muted" : isActive ? "active" : "hover:text-accent"
                                }`
                            }
                        >
                            {item.title}
                        </NavLink>
                    ))}
                </Box>

                <Box>
                    <ConnectButton connectText="Connect Wallet" />
                </Box>
            </Flex>
        </>
    )
}