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

import { ComponentProps } from "react";
import {
	FieldValues,
	FormProvider,
	SubmitHandler,
	UseFormReturn,
	useForm,
	UseFormProps
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface Props<T extends FieldValues>
	extends Omit<ComponentProps<"form">, "onSubmit"> {
	form: UseFormReturn<T>;
	onSubmit: SubmitHandler<T>;
}

const Form = <T extends FieldValues>({
	form,
	onSubmit,
	children,
	style,
	className,
	...props
}: Props<T>) => (
	<FormProvider {...form}>
		<form onSubmit={form.handleSubmit(onSubmit)} {...props}>
			{/* <fieldset> passes the form's 'disabled' state to all of its elements,
            allowing us to handle disabled style variants with just css */}
			<fieldset
				disabled={form.formState.isSubmitting}
				className={className}
				style={style}
			>
				{children}
			</fieldset>
		</form>
	</FormProvider>
);

export { default as FormField } from "./form-field";
export { default as FormInput } from "./form-input";
export { default as FormCombobox } from "./form-combobox";
export { default as FormSelect } from "./form-select";
export { default as FormTextArea } from "./form-textarea";
export default Form;

interface UseZodFormProps<S extends z.ZodSchema>
	extends Exclude<UseFormProps<z.infer<S>>, "resolver"> {
	schema: S;
}

export const useZodForm = <S extends z.ZodSchema>({
	schema,
	...formProps
}: UseZodFormProps<S>) =>
	useForm({
		reValidateMode: "onChange",
		...formProps,
		resolver: zodResolver(schema)
	});
