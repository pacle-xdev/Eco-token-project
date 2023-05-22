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

import clsx from "clsx";
import { type PropsWithChildren } from "react";
import { useFormContext } from "react-hook-form";
import Label from "../Label";

export type UseFormFieldProps = PropsWithChildren<{
	wrapperClass?: string;
	name: string;
	label: string;
}>;

export const useFormField = <P extends UseFormFieldProps>(props: P) => {
	const { label, name, wrapperClass, ...otherProps } = props;
	const id = name;

	return {
		formFieldProps: { id, name, label, wrapperClass },
		childProps: { ...otherProps, id, name }
	};
};

interface Props extends UseFormFieldProps {
	id: string;
}

const FormField = ({
	children,
	name,
	id,
	label,
	wrapperClass: parentClass
}: Props) => {
	const ctx = useFormContext();
	const { error } = ctx.getFieldState(name, ctx.formState);

	return (
		<div className={clsx("space-y-1", parentClass)}>
			<Label htmlFor={id} className="block">
				{label}
			</Label>
			{children}
			{error && (
				<p className="block text-xs font-medium text-gray-700">
					{error.message}
				</p>
			)}
		</div>
	);
};

export default FormField;
