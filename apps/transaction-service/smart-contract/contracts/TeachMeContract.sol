// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TeachMeContract {
    address payable public owner;

    enum ContractStatus {
        PENDING,
        ACTIVE,
        COMPLETED_TUTOR,
        COMPLETED_STUDENT,
        COMPLETED,
        CANCELLED
    }
    enum PaymentType {
        DEPOSIT,
        FEE_PER_SESSION,
        BENEFIT_PACKAGE
    }
    enum PaymentStatus {
        PENDING,
        SUCCESS,
        FAILED
    }

    struct Payment {
        string id;
        uint256 amount;
        uint256 feePercent;
        uint256 timestamp;
        PaymentType paymentType;
        PaymentStatus paymentStatus;
    }

    struct Contract {
        string id;
        string studentId;
        string tutorId;
        string classId;
        uint256 startDate;
        uint256 endDate;
        uint256 endDateActual;
        uint256 depositAmount;
        uint256 totalAmount;
        uint256 feePerSession;
        ContractStatus status;
        string[] paymentIds;
    }

    struct ContractParams {
        string id;
        string studentId;
        string tutorId;
        string classId;
        uint256 startDate;
        uint256 endDate;
        uint256 depositAmount;
        uint256 totalAmount;
        uint256 feePerSession;
    }

    struct ContractExtraParams {
        string grade;
        string subject;
        uint256 feePerHour;
        uint256 totalFee;
        bool mode;
        string[] schedules;
    }

    struct BenefitPackage {
        string id;
        string userId;
        string benefitId;
        uint256 amount;
        uint256 quantity;
    }

    mapping(string => Contract) public contracts; // mapping từ id hợp đồng đến hợp đồng
    mapping(string => Payment) public payments; // mapping từ id payment đến payment
    mapping(string => string[]) contractToPayments; // mapping từ id hợp đồng đến danh sách các payment
    mapping(string => BenefitPackage) public benefitPackages; // mapping từ id gói benefit đến thông tin gói
    mapping(string => string[]) userToBenefitPackages; // mapping từ id người dùng đến danh sách các gói benefit

    event ContractCreated(
        string id,
        string studentId,
        string tutorId,
        string classId,
        uint256 startDate,
        uint256 endDate,
        uint256 depositAmount,
        uint256 totalAmount,
        uint256 feePerSession,
        string grade,
        string subject,
        uint256 feePerHour,
        uint256 totalFee,
        bool mode,
        string[] schedules
    );

    event ContractStatusUpdated(
        string id,
        ContractStatus previousStatus,
        ContractStatus newStatus,
        address updatedBy
    );

    event PaymentAdded(
        string contractId,
        string paymentId,
        uint256 amount,
        PaymentType paymentType,
        PaymentStatus paymentStatus
    );

    event WithdrawExecuted(address owner, uint256 amount, uint256 timestamp);

    event PaymentTuition(
        string paymentId,
        string contractId,
        uint256 paymentDate,
        uint256 amount,
        uint256 feePercent,
        uint256 priceVND
    );

    event BenefitPackagePurchased(
        string id,
        string userId,
        string benefitId,
        uint256 amount,
        uint256 quantity,
        uint256 priceRate
    );

    // Thiết lập người deploy contract là owner
    constructor() {
        owner = payable(msg.sender);
    }

    // Modifier để kiểm tra chỉ owner mới có thể gọi các function nhất định
    modifier onlyOwner() {
        require(
            msg.sender == owner,
            unicode'Chỉ chủ sở hữu mới có thể thực hiện chức năng này'
        );
        _;
    }

    // Modifier kiểm tra người gọi là student của contract
    modifier onlyStudent(string memory _contractId) {
        require(
            keccak256(abi.encodePacked(msg.sender)) ==
                keccak256(abi.encodePacked(contracts[_contractId].studentId)),
            unicode'Chỉ học sinh mới có quyền thực hiện chức năng này'
        );
        _;
    }

    // Modifier kiểm tra người gọi là tutor của contract
    modifier onlyTutor(string memory _contractId) {
        require(
            keccak256(abi.encodePacked(msg.sender)) ==
                keccak256(abi.encodePacked(contracts[_contractId].tutorId)),
            unicode'Chỉ gia sư mới có quyền thực hiện chức năng này'
        );
        _;
    }

    // Modifier kiểm tra người gọi là student hoặc tutor của contract
    modifier onlyStudentOrTutor(string memory _contractId) {
        require(
            keccak256(abi.encodePacked(msg.sender)) ==
                keccak256(abi.encodePacked(contracts[_contractId].studentId)) ||
                keccak256(abi.encodePacked(msg.sender)) ==
                keccak256(abi.encodePacked(contracts[_contractId].tutorId)),
            unicode'Chỉ học sinh hoặc gia sư mới có quyền thực hiện chức năng này'
        );
        _;
    }

    // Function cho phép contract nhận tiền
    receive() external payable {}

    function createContract(
        ContractParams memory params,
        ContractExtraParams memory extraParams
    ) public {
        Contract storage newContract = contracts[params.id];
        newContract.id = params.id;
        newContract.studentId = params.studentId;
        newContract.tutorId = params.tutorId;
        newContract.classId = params.classId;
        newContract.startDate = params.startDate;
        newContract.endDate = params.endDate;
        newContract.endDateActual = params.endDate;
        newContract.depositAmount = params.depositAmount;
        newContract.totalAmount = params.totalAmount;
        newContract.feePerSession = params.feePerSession;
        newContract.status = ContractStatus.PENDING;

        emit ContractCreated(
            params.id,
            params.studentId,
            params.tutorId,
            params.classId,
            params.startDate,
            params.endDate,
            params.depositAmount,
            params.totalAmount,
            params.feePerSession,
            extraParams.grade,
            extraParams.subject,
            extraParams.feePerHour,
            extraParams.totalFee,
            extraParams.mode,
            extraParams.schedules
        );
    }

    function updateContractStatus(
        string memory _contractId,
        ContractStatus _newStatus
    ) public onlyStudentOrTutor(_contractId) {
        Contract storage contractToUpdate = contracts[_contractId];
        ContractStatus currentStatus = contractToUpdate.status;

        // Kiểm tra điều kiện chuyển đổi trạng thái
        if (currentStatus == ContractStatus.PENDING) {
            // Student có thể chuyển từ PENDING sang ACTIVE hoặc CANCELLED
            if (
                keccak256(abi.encodePacked(msg.sender)) ==
                keccak256(abi.encodePacked(contractToUpdate.studentId))
            ) {
                require(
                    _newStatus == ContractStatus.CANCELLED,
                    unicode'Học sinh chỉ có thể chuyển trạng thái từ PENDING sang ACTIVE hoặc CANCELLED'
                );
            }
            // Tutor chỉ có thể chuyển từ PENDING sang CANCELLED
            else if (
                keccak256(abi.encodePacked(msg.sender)) ==
                keccak256(abi.encodePacked(contractToUpdate.tutorId))
            ) {
                require(
                    _newStatus == ContractStatus.CANCELLED,
                    unicode'Gia sư chỉ có thể chuyển trạng thái từ PENDING sang CANCELLED'
                );
            }
        } else if (currentStatus == ContractStatus.ACTIVE) {
            // Student chỉ có thể chuyển từ ACTIVE sang COMPLETED_STUDENT
            if (
                keccak256(abi.encodePacked(msg.sender)) ==
                keccak256(abi.encodePacked(contractToUpdate.studentId))
            ) {
                require(
                    _newStatus == ContractStatus.COMPLETED_STUDENT,
                    unicode'Học sinh chỉ có thể chuyển trạng thái từ ACTIVE sang COMPLETED_STUDENT'
                );

                // Nếu tutor đã đánh dấu COMPLETED_TUTOR, chuyển sang COMPLETED
                if (contractToUpdate.status == ContractStatus.COMPLETED_TUTOR) {
                    _newStatus = ContractStatus.COMPLETED;
                }
            }
            // Tutor chỉ có thể chuyển từ ACTIVE sang COMPLETED_TUTOR
            else if (
                keccak256(abi.encodePacked(msg.sender)) ==
                keccak256(abi.encodePacked(contractToUpdate.tutorId))
            ) {
                require(
                    _newStatus == ContractStatus.COMPLETED_TUTOR,
                    unicode'Gia sư chỉ có thể chuyển trạng thái từ ACTIVE sang COMPLETED_TUTOR'
                );

                // Nếu student đã đánh dấu COMPLETED_STUDENT, chuyển sang COMPLETED
                if (
                    contractToUpdate.status == ContractStatus.COMPLETED_STUDENT
                ) {
                    _newStatus = ContractStatus.COMPLETED;
                }
            }
        } else if (currentStatus == ContractStatus.COMPLETED_STUDENT) {
            // Chỉ tutor mới có thể chuyển từ COMPLETED_STUDENT sang COMPLETED
            require(
                keccak256(abi.encodePacked(msg.sender)) ==
                    keccak256(abi.encodePacked(contractToUpdate.tutorId)) &&
                    _newStatus == ContractStatus.COMPLETED,
                unicode'Chỉ gia sư mới có thể chuyển trạng thái từ COMPLETED_STUDENT sang COMPLETED'
            );
        } else if (currentStatus == ContractStatus.COMPLETED_TUTOR) {
            // Chỉ student mới có thể chuyển từ COMPLETED_TUTOR sang COMPLETED
            require(
                keccak256(abi.encodePacked(msg.sender)) ==
                    keccak256(abi.encodePacked(contractToUpdate.studentId)) &&
                    _newStatus == ContractStatus.COMPLETED,
                unicode'Chỉ học sinh mới có thể chuyển trạng thái từ COMPLETED_TUTOR sang COMPLETED'
            );
        } else {
            // Không cho phép thay đổi trạng thái nếu contract đã COMPLETED hoặc CANCELLED
            revert(
                unicode'Không thể thay đổi trạng thái của hợp đồng đã hoàn thành hoặc đã hủy'
            );
        }

        // Cập nhật trạng thái và thời gian
        contractToUpdate.status = _newStatus;

        // Nếu trạng thái mới là COMPLETED, cập nhật endDateActual
        if (_newStatus == ContractStatus.COMPLETED) {
            contractToUpdate.endDateActual = block.timestamp;
        }

        // Phát ra event khi cập nhật trạng thái
        emit ContractStatusUpdated(
            _contractId,
            currentStatus,
            _newStatus,
            msg.sender
        );
    }

    function paymentTutition(
        string memory _contractId,
        string memory _id,
        address payable recipient,
        uint256 amount,
        uint256 feePercent,
        uint256 priceVND
    ) public payable {
        require(msg.value > 0, unicode'Cần gửi một lượng ETH lớn hơn 0');

        uint256 amountForTutor = msg.value - ((msg.value * feePercent) / 100);
        uint256 amountForOwner = (msg.value * feePercent) / 100;

        // Chuyển 50% cho người nhận
        recipient.transfer(amountForTutor);

        // Chuyển 50% còn lại cho owner của contract
        owner.transfer(amountForOwner);

        Payment storage newPayment = payments[_id];
        newPayment.id = _id;
        newPayment.amount = amount;
        newPayment.feePercent = feePercent;
        newPayment.timestamp = block.timestamp;
        newPayment.paymentType = PaymentType.FEE_PER_SESSION;
        newPayment.paymentStatus = PaymentStatus.SUCCESS;

        contractToPayments[_contractId].push(_id);

        emit PaymentTuition(
            _id,
            _contractId,
            block.timestamp,
            amount,
            feePercent,
            priceVND
        );
    }

    // Function để kiểm tra số dư của contract
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    // Function rút toàn bộ tiền về ví của owner
    function withdraw() public onlyOwner {
        uint amount = address(this).balance;
        (bool success, ) = owner.call{value: amount}('');
        require(success, unicode'Chuyển tiền thất bại');
    }

    // Function rút một lượng tiền cụ thể về ví của owner
    function withdrawAmount(uint _amount) public onlyOwner {
        require(_amount <= address(this).balance, unicode'Số dư không đủ');
        (bool success, ) = owner.call{value: _amount}('');
        require(success, unicode'Chuyển tiền thất bại');
    }

    function deposit(
        string memory _contractId,
        uint256 _ethVndRate
    ) public payable {
        Contract storage contractToDeposit = contracts[_contractId];

        // Kiểm tra contract tồn tại và đang ở trạng thái PENDING
        require(
            bytes(contractToDeposit.id).length > 0,
            unicode'Hợp đồng không tồn tại'
        );
        require(
            contractToDeposit.status == ContractStatus.PENDING,
            unicode'Hợp đồng không ở trạng thái chờ đặt cọc'
        );

        uint256 _depositAmount = msg.value * _ethVndRate;

        // Kiểm tra số tiền gửi vào
        require(
            contractToDeposit.depositAmount == _depositAmount,
            unicode'Số tiền đặt cọc không khớp với hợp đồng'
        );

        // Tạo payment record mới
        string memory paymentId = string(
            abi.encodePacked(_contractId, '-deposit')
        );

        Payment storage newPayment = payments[paymentId];
        newPayment.id = paymentId;
        newPayment.amount = msg.value;
        newPayment.timestamp = block.timestamp;
        newPayment.paymentType = PaymentType.DEPOSIT;
        newPayment.paymentStatus = PaymentStatus.SUCCESS;

        // Thêm payment vào contract
        contractToPayments[_contractId].push(paymentId);

        // Chuyển trạng thái contract sang ACTIVE
        contractToDeposit.status = ContractStatus.ACTIVE;

        // Emit events
        emit PaymentAdded(
            _contractId,
            paymentId,
            msg.value,
            PaymentType.DEPOSIT,
            PaymentStatus.SUCCESS
        );

        emit ContractStatusUpdated(
            _contractId,
            ContractStatus.PENDING,
            ContractStatus.ACTIVE,
            msg.sender
        );
    }

    function buyBenefit(
        string memory _id,
        string memory _userId,
        string memory _benefitId,
        uint256 _quantity,
        uint256 _priceRate
    ) public payable {
        require(msg.value > 0, unicode'Cần gửi một lượng ETH lớn hơn 0');

        // Tạo gói benefit mới
        BenefitPackage storage newPackage = benefitPackages[_id];
        newPackage.id = _id;
        newPackage.userId = _userId;
        newPackage.benefitId = _benefitId;
        newPackage.amount = msg.value;
        newPackage.quantity = _quantity;

        // Thêm gói benefit vào danh sách của người dùng
        userToBenefitPackages[_userId].push(_id);

        // Tạo payment record mới
        string memory paymentId = string(abi.encodePacked(_id, '-payment'));

        Payment storage newPayment = payments[paymentId];
        newPayment.id = paymentId;
        newPayment.amount = msg.value;
        newPayment.timestamp = block.timestamp;
        newPayment.paymentType = PaymentType.BENEFIT_PACKAGE;
        newPayment.paymentStatus = PaymentStatus.SUCCESS;

        // Chuyển tiền vào ví của owner
        owner.transfer(msg.value);

        // Emit event
        emit BenefitPackagePurchased(
            _id,
            _userId,
            _benefitId,
            msg.value,
            _quantity,
            _priceRate
        );
    }
}
