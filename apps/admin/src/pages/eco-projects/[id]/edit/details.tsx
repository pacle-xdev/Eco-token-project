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

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ProjectTabPanel from "@/components/eco-project/project-tab-panel";
import { formatCountryAndState } from "@/utils/formatter";
import { trpc } from "@/utils/trpc";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-hot-toast";
import { editEcoProjectSchema } from "@ecotoken/api/src/schema/project";
import Button from "@ecotoken/ui/components/Button";
import DefaultCard, { CardTitle } from "@ecotoken/ui/components/Card";
import Form, {
    FormInput,
    FormSelect,
    useZodForm,
} from "@ecotoken/ui/components/Form";
import Spinner from "@ecotoken/ui/components/Spinner";

const EditEcoProject = () => {
    const router = useRouter();
    const context = trpc.useContext();

    const { id } = router.query;

    const { data: ecoLocations, isLoading: fetchingEcoLocations } =
        trpc.ecoLocations.getAll.useInfiniteQuery({});

    const cachedLocations = useMemo(
        () => ecoLocations?.pages.flatMap((page) => page.locations),
        [ecoLocations],
    );

    const { data: fetchedProject, isLoading: fetchingProject } =
        trpc.ecoProjects.get.useQuery(
            {
                projectID: id as string,
            },
            {
                enabled: !!id,
                onSuccess(data) {
                    if (data) {
                        const {
                            dateStart,
                            dateEnd,
                            locationID,
                            needsFunding,
                            fundAmount,
                            fundRecieved,
                            return: projectReturn,
                            period,
                            duration,
                        } = data;
                        form.reset({
                            dateStart,
                            dateEnd,
                            locationID: locationID ?? undefined,
                            needsFunding,
                            fundAmount,
                            fundRecieved,
                            return: projectReturn,
                            period,
                            duration,
                        });
                    }
                },
            },
        );

    const { mutateAsync: editMutate, isLoading: isUpdating } =
        trpc.ecoProjects.update.useMutation({
            onSuccess: async () => {
                await context.ecoProjects.getAll.invalidate();
                await context.ecoProjects.get.invalidate({
                    projectID: id as string,
                });
                toast.success("Project has been edited.");
            },
            onError(e) {
                toast.error(e.message);
            },
        });

    const form = useZodForm({
        schema: editEcoProjectSchema.omit({
            projectID: true,
        }),
    });

    const needsFunding = form.watch("needsFunding");

    if (!fetchedProject) {
        if (fetchingProject) return <Spinner />;
        else {
            toast.error("Project does not exist.");
            router.push("/eco-projects");
            return null;
        }
    } else
        return (
            <ProjectTabPanel index={2} projectId={id}>
                <DefaultCard
                    className="flex w-full flex-col space-y-4"
                    size="half"
                >
                    <div className="flex space-x-2">
                        <Link href="/eco-projects" className="inline-block">
                            <FontAwesomeIcon
                                icon={faArrowLeft}
                                size="lg"
                                className="mt-1.5 text-slate-400"
                            />
                        </Link>
                        <div>
                            <CardTitle>Project Details</CardTitle>
                        </div>
                    </div>
                    <Form
                        form={form}
                        onSubmit={async (data) => {
                            await editMutate({
                                ...data,
                                projectID: id as string,
                            });
                        }}
                        className="flex w-fit flex-col gap-4"
                    >
                        <FormInput
                            label="Start Date"
                            type="date"
                            size="xl"
                            wrapperClass="w-fit"
                            {...form.register("dateStart", {
                                valueAsDate: true,
                            })}
                        />
                        <FormInput
                            label="End Date"
                            type="date"
                            size="xl"
                            wrapperClass="w-fit"
                            {...form.register("dateEnd", {
                                valueAsDate: true,
                            })}
                        />
                        <FormSelect
                            label="Location"
                            size="xl"
                            wrapperClass="w-fit"
                            defaultValue=""
                            {...form.register("locationID")}
                        >
                            <option value="" hidden></option>
                            {cachedLocations?.map((location) => (
                                <option
                                    key={location.locationID}
                                    value={location.locationID}
                                >
                                    {formatCountryAndState(
                                        location.location,
                                        location.cn,
                                        location.st,
                                    )}
                                </option>
                            ))}
                        </FormSelect>
                        <FormInput
                            label="Needs Funding"
                            type="checkbox"
                            size="xl"
                            wrapperClass="w-fit flex space-x-2"
                            className="w-fit"
                            {...form.register("needsFunding")}
                        />
                        {needsFunding && (
                            <div className="flex gap-4">
                                <div className="space-y-2">
                                    <FormInput
                                        label="Fund Amount"
                                        size="xl"
                                        wrapperClass="w-fit"
                                        {...form.register("fundAmount", {
                                            valueAsNumber: true,
                                        })}
                                    />
                                    <FormInput
                                        label="Fund Recieved"
                                        size="xl"
                                        wrapperClass="w-fit"
                                        {...form.register("fundRecieved", {
                                            valueAsNumber: true,
                                        })}
                                    />
                                    <FormInput
                                        label="Return"
                                        size="xl"
                                        wrapperClass="w-fit"
                                        {...form.register("return", {
                                            valueAsNumber: true,
                                        })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <FormInput
                                        label="Duration"
                                        size="xl"
                                        wrapperClass="w-fit"
                                        {...form.register("duration", {
                                            valueAsNumber: true,
                                        })}
                                    />
                                    <FormInput
                                        label="Period"
                                        size="xl"
                                        wrapperClass="w-fit"
                                        {...form.register("period", {
                                            valueAsNumber: true,
                                        })}
                                    />
                                </div>
                            </div>
                        )}

                        <Button
                            fullWidth
                            loading={
                                fetchingProject ||
                                fetchingEcoLocations ||
                                isUpdating
                            }
                        >
                            Update
                        </Button>
                    </Form>
                </DefaultCard>
            </ProjectTabPanel>
        );
};

export default EditEcoProject;
