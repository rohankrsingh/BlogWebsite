import { Link } from "@heroui/link"
import { Outlet, useParams } from 'react-router-dom';
import { Settings, User, Bell, Building2, ExpandIcon as Extension } from "lucide-react"
const sidebarItems = [
    { icon: User, label: "Profile", href: "/settings/profile" },
    { icon: Settings, label: "Customization", href: "/settings/customization" },
    { icon: Bell, label: "Notifications", href: "/settings/notifications" },
    { icon: Building2, label: "Organization", href: "/settings/organization" },
    { icon: Extension, label: "Extensions", href: "/settings/extensions" },
]

export default function Layout({ children }) {
    const select = useParams()
    console.log(select);
    
    return (
        <div className="flex max-w-[1200px] mx-auto p-8 max-md:flex-col">
            <aside className="w-64 max-md:w-auto">
                <nav className="p-6 space-y-2 items-center max-md:space-x-0  max-md:flex  max-md:p-2 max-md:overflow-auto">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-4 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>
            <main className="flex-1 p-6"><Outlet /></main>
        </div>
    )

}
