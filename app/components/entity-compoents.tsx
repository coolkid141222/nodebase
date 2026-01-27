import { Button } from "@/components/button"
import { Input } from "@/components/input"
import { AlertTriangleIcon, BellIcon, Loader2Icon, MoreVerticalIcon, PlusIcon, SearchIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/empty"
import { cn } from "@/lib/utils"
import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu"

type EntityHeaderProps = {
    title: string;
    description?: string;
    newButtonLabel: string;
    disabled?: boolean;
    isCreating?: boolean;
} & (
        | { onNew: () => void; newButtonHref?: never }
        | { newButtonHref: string; onNew?: never }
        | { onNew?: never; newButtonHref?: never }
    )

export const EntityHeader = ({
    title,
    description,
    newButtonLabel,
    disabled,
    isCreating,
    onNew,
    newButtonHref,
}: EntityHeaderProps) => {
    return (
        <div className="flex flex-row items-center justify-between gap-x-4">
            <div className="flex flex-col">
                <p className="text-xl font-semibold">
                    {title}
                </p>
                <h1 className="text-lg md:text-xl font-semibold">
                    {description && (
                        <p className="text-xs md:text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                </h1>
            </div>
            {onNew && !newButtonHref && (
                <Button disabled={isCreating || disabled} size="sm" onClick={onNew}>
                    <PlusIcon className="size-4" />
                    {newButtonLabel}
                </Button>
            )}
            {newButtonHref && !onNew && (
                <Button size="sm" asChild>
                    <Link href={newButtonHref} prefetch>
                        <PlusIcon className="size-4" />
                        {newButtonLabel}
                    </Link>
                </Button>
            )}
        </div>
    )
}

type EntityContainerProps = {
    children: React.ReactNode
    header?: React.ReactNode
    search?: React.ReactNode
    pagination?: React.ReactNode
}

export const EntityContainer = ({
    children,
    header,
    search,
    pagination,
}: EntityContainerProps) => {
    return (
        <div className="p-4 md:px-10 md:py-6 h-full">
            <div className="mx-auto max-w-screen-full flex flex-col gap-y-8 h-full">
                {header}
                <div className="flex flex-col gap-y-4 h-full">
                    {search}
                    {children}
                </div>
                {pagination}
            </div>
        </div>
    )
}

interface EntitySearchProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const EntitySearch = ({
    value,
    onChange,
    placeholder,
}: EntitySearchProps) => {
    return (
        <div className="relative ml-auto">
            <SearchIcon className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
                className="max-w-[200px] bg-background shadow-none
                border-border pl-8"
                placeholder={placeholder || "Search..."}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    )
}

interface EntityPaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    disabled?: boolean;
}

export const EntityPagination = ({
    page,
    totalPages,
    onPageChange,
    disabled,
}: EntityPaginationProps) => {
    return (
        <div className="flex items-center justify-between gap-x-2">
            <div className="flex-1 text-sm text-muted-foreground">
                Page {page} of {totalPages || 1}
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button 
                    disabled={disabled || page <= 1}
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                >
                    Previous
                </Button>
                <Button
                    disabled={disabled || page === totalPages || totalPages === 0}
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
interface ErrorViewProps {
    message?: string
}

interface LoadingViewProps extends ErrorViewProps {
    entity?: string
}

export const LoadingView = ({
    entity = "items",
    message,
}: LoadingViewProps) => {
    return (
        <div className="flex justify-center items-center h-full flex-1 flex-col gap-y-4">
            <Loader2Icon className="size-6 animate-spin text-muted-foreground"/>
            {!!message && 
                <p className="text-sm text-muted-foreground">
                    {message || `Loading ${entity}...`}
                </p>
            }
        </div>
    )
}

export const ErrorView = ({
    entity = "items",
    message,
}: LoadingViewProps) => {
    return (
        <div className="flex justify-center items-center h-full flex-1 flex-col gap-y-4">
            <AlertTriangleIcon className="size-6 text-muted-foreground"/>
            {!!message && 
                <p className="text-sm text-muted-foreground">
                    {message || `Loading ${entity}...`}
                </p>
            }
        </div>
    )
}

interface EmptyViewProps {
    onNew?: () => void;
    isPending?: boolean;
};

export const EmptyView = ({
    onNew,
    isPending,
}: EmptyViewProps) => {
    return (
        <Empty className="bg-muted/30 h-full">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <BellIcon />
                </EmptyMedia>
                <EmptyTitle>No Items</EmptyTitle>
                <EmptyDescription className="max-w-xs text-pretty">
                    You&apos;re all caught up. New items will appear here.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Button variant="outline" onClick={onNew} disabled={isPending}>
                <PlusIcon />
                    Create
                </Button>
            </EmptyContent>
        </Empty>
    )   
}

interface EntityListProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    getKey?: (item: T, index: number) => string | number;
    emptyView?: React.ReactNode;
    className?: string;
}

export function EntityList<T>({
    items,
    renderItem,
    getKey,
    emptyView,  
    className,
}: EntityListProps<T>) {
    if (items.length === 0 && emptyView) {
        return (
            <div className="flex-1 flex justify-center items-center">
                <div className="max-w-full mx-auto">
                    {emptyView} 
                </div>
            </div>
        )
    }
    return (
        <div className={cn(
            "flex flex-col gap-y-4"
        )}>
            {
                items.map((item, index) => (
                    <div key={getKey ? getKey(item, index) : index}>
                        {renderItem(item, index)}
                    </div>
                ))
            }
        </div>
    )
}

interface EntityItemProps {
    href: string;
    title: string
    subtitle?: React.ReactNode;
    image?: React.ReactNode;
    actions?: React.ReactNode;
    onRemove?: () => void | Promise<void>;
    isRemoving?: boolean;
    className?: string;
}

export const EntityItem = ({
    href,
    title,
    subtitle,
    image,
    actions,
    onRemove,
    isRemoving,
    className,
}: EntityItemProps) => {

    const handleRemove = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isRemoving) {
            return;
        }
        await onRemove?.();
    }
    return (
        <Link href={href} prefetch>
            <Card className={cn(
                "p-4 shadow-none hover:shadow-md cursor-pointer",
                isRemoving && "opacity-50 cursor-not-allowed",
                className
            )}>
            <CardContent className="flex items-center justify-between p-0">
                <div className="flex items-center gap-3">
                    {image}
                    <div>
                        <CardTitle className="text-base font-medium">
                            {title}
                        </CardTitle>
                        {!!subtitle && (
                            <CardDescription className="text-xs">
                                {subtitle}
                            </CardDescription>
                        )}
                    </div>
                </div>
                {(actions || onRemove) && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" disabled={isRemoving}>
                                {isRemoving ? (
                                    <Loader2Icon className="size-4 animate-spin" />
                                ) : (
                                    <MoreVerticalIcon className="size-4" />
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {actions}
                            {onRemove && (
                                <DropdownMenuItem onClick={handleRemove}>
                                    <TrashIcon className="size-4 mr-2" />
                                    Remove
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </CardContent>    
            </Card>
        </Link>
    )
}