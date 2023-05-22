/*
 * Copyright (C) 2023 EcoToken Systems
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import Link from "next/link";
import { useRouter } from "next/router";
import { formatEnum } from "@/utils/formatter";
import { trpc } from "@/utils/trpc";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";
import { toast } from "react-hot-toast";
import {
    ecoOrderStatus,
    updateEcoOrderSchema,
} from "@ecotoken/api/src/schema/order";
import Button from "@ecotoken/ui/components/Button";
import { CardDescription, CardTitle } from "@ecotoken/ui/components/Card";
import Form, {
    FormInput,
    FormSelect,
    useZodForm,
} from "@ecotoken/ui/components/Form";
import Spinner from "@ecotoken/ui/components/Spinner";

const EditEcoOrder = () => {
    const router = useRouter();

    let { id } = router.query;
    if (typeof id !== "string" && typeof id !== "undefined") id = id[0];
    if (!id) id = "";

    const { data: orderDetails, isLoading: fetchingOrder } =
        trpc.ecoOrders.get.useQuery(
            {
                ecoOrderID: id,
            },
            {
                enabled: !!id,
                onSuccess(order) {
                    console.log("success fetch", order);
                    form.reset({
                        ...order,
                        retireFee:
                            (order?.retireFee as unknown as number) ??
                            undefined,
                    });
                },
            },
        );

    const context = trpc.useContext();

    const { mutateAsync: editOrder, isLoading: isEditingOrder } =
        trpc.ecoOrders.update.useMutation({
            onSuccess: async () => {
                await context.ecoOrders.getAll.invalidate();
                await context.ecoOrders.get.invalidate({
                    ecoOrderID: id as string,
                });
                toast.success("Order has been edited.");
            },
            onError(e) {
                toast.error(e.message);
            },
        });

    const { mutateAsync: deleteOrder, isLoading: isDeletingOrder } =
        trpc.ecoOrders.delete.useMutation({
            onSuccess: async () => {
                await context.ecoOrders.getAll.invalidate();
                router.push("/eco-projects/orders");
                toast.success("Order has been deleted.");
            },
            onError(e) {
                toast.error(e.message);
            },
        });

    const form = useZodForm({
        schema: updateEcoOrderSchema.omit({ ecoOrderID: true }),
    });
    if (!orderDetails) {
        if (fetchingOrder) return <Spinner />;
        else {
            toast.error("Order does not exist.");
            router.push("/eco-projects/orders");
            return null;
        }
    }
    return (
        <Transition
            show
            appear
            enter="ease-out duration-500"
            enterFrom="opacity-0 -translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="ease-in duration-500"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-2"
            className="space-y-4"
        >
            <div className="flex space-x-2">
                <Link href="/eco-projects/orders" className="inline-block">
                    <FontAwesomeIcon
                        icon={faArrowLeft}
                        size="lg"
                        className="mt-1.5 text-slate-400"
                    />
                </Link>
                <div>
                    <CardTitle>Edit Order</CardTitle>
                    <CardDescription>
                        Update an order for an NFT series.
                    </CardDescription>
                </div>
            </div>
            <Form
                form={form}
                className="flex w-full flex-col gap-4"
                onSubmit={async (order) => {
                    await editOrder({
                        ...order,
                        ecoOrderID: id as string,
                    });
                }}
            >
                <FormSelect
                    size="full"
                    label="Order Status"
                    {...form.register("orderStatus")}
                >
                    {ecoOrderStatus.shape.orderStatus.options?.map((status) => (
                        <option key={status} value={status}>
                            {formatEnum(status)}
                        </option>
                    ))}
                </FormSelect>
                <FormInput
                    size="full"
                    label="Retire Fee"
                    {...form.register("retireFee", {
                        valueAsNumber: true,
                    })}
                />
                <FormInput
                    size="full"
                    label="Retire Hash"
                    {...form.register("retireHash")}
                />
                <div className="space-y-1">
                    <Button fullWidth loading={isEditingOrder || fetchingOrder}>
                        Update
                    </Button>
                    <Button
                        intent="destructive"
                        type="button"
                        fullWidth
                        loading={isDeletingOrder}
                        onClick={async () =>
                            await deleteOrder({
                                ecoOrderID: id as string,
                            })
                        }
                    >
                        Delete
                    </Button>
                </div>
            </Form>
        </Transition>
    );
};

export default EditEcoOrder;
