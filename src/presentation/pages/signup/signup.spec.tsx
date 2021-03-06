import React from "react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { IconBaseProps } from "react-icons";
import faker from "faker";
import {
    RenderResult,
    render,
    cleanup,
    fireEvent,
    waitFor,
} from "@testing-library/react";
import { SignUp } from "@/presentation/pages";
import {
    AddAccountSpy,
    Helper,
    SaveAccessTokenMock,
    ValidationStub,
} from "@/presentation/test";
import { EmailInUseError } from "@/domain/errors";

type SutTypes = {
    sut: RenderResult;
    addAccountSpy: AddAccountSpy;
    saveAccessTokenMock: SaveAccessTokenMock;
};

type SutParams = {
    validationError: string;
};

const history = createMemoryHistory({ initialEntries: ["/signup"] });

const makeSut = (params?: SutParams): SutTypes => {
    const validationStub = new ValidationStub();
    validationStub.errorMessage = params?.validationError;

    const addAccountSpy = new AddAccountSpy();
    const saveAccessTokenMock = new SaveAccessTokenMock();

    const sut = render(
        <Router history={history}>
            <SignUp
                validation={validationStub}
                addAccount={addAccountSpy}
                saveAccessToken={saveAccessTokenMock}
            />
        </Router>,
    );

    return { sut, addAccountSpy, saveAccessTokenMock };
};

const simulateValidSubmit = async (
    sut: RenderResult,
    name = faker.internet.email(),
    email = faker.internet.email(),
    password = faker.internet.password(),
): Promise<void> => {
    Helper.populateField(sut, "name", name);
    Helper.populateField(sut, "email", email);
    Helper.populateField(sut, "password", password);
    Helper.populateField(sut, "passwordConfirmation", password);

    const form = sut.getByTestId("form");
    fireEvent.submit(form);

    await waitFor(() => form);
};

describe("SignUp Component", () => {
    afterEach(cleanup);

    // eslint-disable-next-line jest/expect-expect
    test("Should start with initial state", () => {
        const validationError = faker.random.words();
        const { sut } = makeSut({ validationError });

        const nameErrorIcon = sut.getByTestId(
            "name-error-icon",
        ) as IconBaseProps;

        const emailErrorIcon = sut.getByTestId(
            "email-error-icon",
        ) as IconBaseProps;

        const passwordErrorIcon = sut.getByTestId(
            "password-error-icon",
        ) as IconBaseProps;

        const passwordConfirmationErrorIcon = sut.getByTestId(
            "passwordConfirmation-error-icon",
        ) as IconBaseProps;

        Helper.testStatusForField(sut, "name", validationError, nameErrorIcon);
        Helper.testStatusForField(
            sut,
            "email",
            validationError,
            emailErrorIcon,
        );
        Helper.testStatusForField(
            sut,
            "password",
            validationError,
            passwordErrorIcon,
        );
        Helper.testStatusForField(
            sut,
            "passwordConfirmation",
            validationError,
            passwordConfirmationErrorIcon,
        );
        Helper.testChildCount(sut, "error-wrap", 0);
        Helper.testButtonIsDisabled(sut, "submit", true);
    });

    // eslint-disable-next-line jest/expect-expect
    test("Should show name error if Validation fails", () => {
        const validationError = faker.random.words();
        const { sut } = makeSut({ validationError });
        const fieldName = "name";

        Helper.populateField(sut, fieldName);

        const nameErrorIcon = sut.getByTestId(
            `${fieldName}-error-icon`,
        ) as IconBaseProps;

        Helper.testStatusForField(
            sut,
            fieldName,
            validationError,
            nameErrorIcon,
        );
    });

    // eslint-disable-next-line jest/expect-expect
    test("Should show email error if Validation fails", () => {
        const validationError = faker.random.words();
        const { sut } = makeSut({ validationError });
        const fieldName = "email";

        Helper.populateField(sut, fieldName);

        const emailErrorIcon = sut.getByTestId(
            `${fieldName}-error-icon`,
        ) as IconBaseProps;

        Helper.testStatusForField(
            sut,
            fieldName,
            validationError,
            emailErrorIcon,
        );
    });

    // eslint-disable-next-line jest/expect-expect
    test("Should show password error if Validation fails", () => {
        const validationError = faker.random.words();
        const { sut } = makeSut({ validationError });
        const fieldName = "password";

        Helper.populateField(sut, fieldName);

        const passwordErrorIcon = sut.getByTestId(
            `${fieldName}-error-icon`,
        ) as IconBaseProps;

        Helper.testStatusForField(
            sut,
            fieldName,
            validationError,
            passwordErrorIcon,
        );
    });

    // eslint-disable-next-line jest/expect-expect
    test("Should show passwordConfirmation error if Validation fails", () => {
        const validationError = faker.random.words();
        const { sut } = makeSut({ validationError });
        const fieldName = "passwordConfirmation";

        Helper.populateField(sut, fieldName);

        const passwordConfirmationErrorIcon = sut.getByTestId(
            `${fieldName}-error-icon`,
        ) as IconBaseProps;

        Helper.testStatusForField(
            sut,
            fieldName,
            validationError,
            passwordConfirmationErrorIcon,
        );
    });

    // eslint-disable-next-line jest/expect-expect
    test("Should show valid name state if Validation succeeds", () => {
        const { sut } = makeSut();
        Helper.populateField(sut, "name");

        Helper.testStatusForField(sut, "name");
    });

    // eslint-disable-next-line jest/expect-expect
    test("Should show valid email state if Validation succeeds", () => {
        const { sut } = makeSut();
        Helper.populateField(sut, "email");

        Helper.testStatusForField(sut, "email");
    });

    // eslint-disable-next-line jest/expect-expect
    test("Should show valid password state if Validation succeeds", () => {
        const { sut } = makeSut();
        Helper.populateField(sut, "password");

        Helper.testStatusForField(sut, "password");
    });

    // eslint-disable-next-line jest/expect-expect
    test("Should show valid passwordConfirmation state if Validation succeeds", () => {
        const { sut } = makeSut();
        Helper.populateField(sut, "passwordConfirmation");

        Helper.testStatusForField(sut, "passwordConfirmation");
    });

    // eslint-disable-next-line jest/expect-expect
    test("Should enable submit button if form is valid", () => {
        const { sut } = makeSut();

        Helper.populateField(sut, "name");
        Helper.populateField(sut, "email");
        Helper.populateField(sut, "password");
        Helper.populateField(sut, "passwordConfirmation");
        Helper.testButtonIsDisabled(sut, "submit", false);
    });

    // eslint-disable-next-line jest/expect-expect
    test("Should show spinner on submit", async () => {
        const { sut } = makeSut();

        await simulateValidSubmit(sut);

        Helper.testElementExists(sut, "spinner");
    });

    test("Should call AddAccount with correct values", async () => {
        const { sut, addAccountSpy } = makeSut();
        const name = faker.name.findName();
        const email = faker.internet.email();
        const password = faker.internet.password();

        await simulateValidSubmit(sut, name, email, password);

        expect(addAccountSpy.params).toEqual({
            name,
            email,
            password,
            passwordConfirmation: password,
        });
    });

    test("Should call AddAccount only once", async () => {
        const { sut, addAccountSpy } = makeSut();

        await simulateValidSubmit(sut);
        await simulateValidSubmit(sut);

        expect(addAccountSpy.callsCount).toBe(1);
    });

    test("Should not call AddAccount if form is invalid", async () => {
        const validationError = faker.random.words();
        const { sut, addAccountSpy } = makeSut({ validationError });

        await simulateValidSubmit(sut);

        expect(addAccountSpy.callsCount).toBe(0);
    });

    // eslint-disable-next-line jest/expect-expect
    test("Should present error if AddAccount fails", async () => {
        const { sut, addAccountSpy } = makeSut();
        const error = new EmailInUseError();

        jest.spyOn(addAccountSpy, "add").mockRejectedValueOnce(error);

        await simulateValidSubmit(sut);

        Helper.testChildCount(sut, "error-wrap", 1);
        Helper.testElementText(sut, "main-error", error.message);
    });

    test("Should call SaveAccessToken on success", async () => {
        const { sut, addAccountSpy, saveAccessTokenMock } = makeSut();

        await simulateValidSubmit(sut);

        expect(saveAccessTokenMock.accessToken).toBe(
            addAccountSpy.account.accessToken,
        );
        expect(history.length).toBe(1);
        expect(history.location.pathname).toBe("/");
    });

    // eslint-disable-next-line jest/expect-expect
    test("Should present error if SaveAccessToken fails", async () => {
        const { sut, saveAccessTokenMock } = makeSut();
        const error = new EmailInUseError();

        jest.spyOn(saveAccessTokenMock, "save").mockRejectedValueOnce(error);

        await simulateValidSubmit(sut);

        Helper.testChildCount(sut, "error-wrap", 1);
        Helper.testElementText(sut, "main-error", error.message);
    });

    test("Should go to login page", () => {
        const { sut } = makeSut();
        const loginLink = sut.getByTestId("login-link");
        fireEvent.click(loginLink);

        expect(history.length).toBe(1);
        expect(history.location.pathname).toBe("/login");
    });
});
