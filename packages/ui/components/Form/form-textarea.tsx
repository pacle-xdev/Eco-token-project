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

import { forwardRef } from "react";
import Root, { type Props as RootProps } from "../TextArea";
import FormField, { type UseFormFieldProps, useFormField } from "./form-field";

interface Props extends UseFormFieldProps, RootProps {
    name: string;
}

const FormTextArea = forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
    const { formFieldProps, childProps } = useFormField(props);

    return (
        <FormField {...formFieldProps}>
            <Root {...childProps} ref={ref} />
        </FormField>
    );
});

export default FormTextArea;
