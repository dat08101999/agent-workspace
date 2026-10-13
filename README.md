# Agent Workspace

Agent Workspace là app macOS đặt Claude Code, Codex và Antigravity trong một cửa sổ, để bạn thấy agent nào đang chạy và agent nào đang đợi bạn.

<img src="images/app-icon.png" width="128" alt="Agent Workspace">

Tải bản mới nhất: [Agent-Workspace-arm64.dmg](https://github.com/dat08101999/agent-workspace/releases/latest/download/Agent-Workspace-arm64.dmg) (các bản khác ở trang [Releases](https://github.com/dat08101999/agent-workspace/releases)).

Repo này chỉ có tài liệu và tệp cài đặt. Mã nguồn không nằm ở đây.

## App này làm gì

Bạn mở vài agent cùng lúc, mỗi agent làm việc trong một thư mục khác nhau. Một agent dừng lại để hỏi bạn xem có cho sửa tệp không. Bạn đang ở cửa sổ khác nên không biết. Agent cứ đợi.

Agent Workspace gom các chat vào một thanh bên. Chat nào đang chạy, chat nào đang đợi bạn đều hiện ngay ở đó. Khi cần bạn, app báo bằng thông báo macOS và con số trên biểu tượng Dock. Bạn trả lời ngay trong app.

App dùng các công cụ Claude Code, Codex và Antigravity đã cài và đã đăng nhập sẵn trên máy bạn. App không có tài khoản riêng.

## Cần gì để chạy

- Máy Mac dùng chip Apple silicon.
- `python3` có trong máy. Bản đi kèm Xcode Command Line Tools là đủ; nếu chưa có, chạy `xcode-select --install` trong Terminal.
- Ít nhất một trong ba công cụ: Claude Code, Codex, Antigravity. Công cụ đó phải đã cài và đã đăng nhập.

Bạn không cần cài .NET hay Node. Phần server đã đi kèm trong app.

## Cài đặt

1. Bấm đường dẫn ở trên, hoặc vào trang Releases, tải tệp `Agent-Workspace-arm64.dmg`.
2. Mở tệp DMG, kéo `Agent Workspace` vào thư mục Applications.
3. Mở `Agent Workspace` từ Applications. Lần đầu macOS sẽ chặn và báo không xác minh được app.

App chưa được ký bằng Apple Developer ID và chưa được Apple công chứng (notarize), nên macOS chặn ở lần mở đầu. Để cho phép:

1. Đóng hộp thoại cảnh báo của macOS.
2. Mở Cài đặt hệ thống → Quyền riêng tư & Bảo mật.
3. Kéo xuống phần Bảo mật. Bạn sẽ thấy một dòng nói `Agent Workspace` đã bị chặn.
4. Bấm "Vẫn mở". Nếu macOS dùng tiếng Anh: System Settings → Privacy & Security → "Open Anyway".
5. Xác nhận bằng mật khẩu Mac hoặc Touch ID khi macOS hỏi, rồi mở app lại.

Những lần sau bạn mở app như bình thường.

## Lần mở đầu

1. Thêm một thư mục. Ở cuối danh sách thư mục trên thanh bên có dòng "Thêm thư mục". Một thư mục trên đĩa là một nơi làm việc của app.
2. Mở một chat trong thư mục đó bằng dấu "+" cạnh tên thư mục.
3. Chọn chat chạy ở đâu (Claude Code, Codex hoặc Antigravity), rồi chọn model và mức effort.
4. Gõ tin đầu tiên và gửi.

Chat mới là một bản nháp. App chưa tạo cuộc trò chuyện nào ở nhà cung cấp cho đến khi bạn gửi tin đầu tiên.

![Lần mở đầu: chưa có thư mục nào](images/lan-mo-dau.png)

## Cách hoạt động

App là một cửa sổ native, bên trong là một trang web chạy trên máy bạn. Trang đó do một server nhỏ phát ra. App tự khởi động server này. Server chỉ nghe ở `127.0.0.1` (cổng 5188). Server nói chuyện với Claude Code, Codex và Antigravity ngay trên máy. Các script phụ chạy bằng `python3` của máy.

```
Cửa sổ app  <->  server cục bộ 127.0.0.1:5188  <->  Claude Code / Codex / Antigravity
                                                     (trên máy Mac của bạn)
```

App không gọi API model nào. Mọi lượt chạy đều do công cụ của nhà cung cấp thực hiện.

## Tính năng

### Thấy

- Thanh bên cho biết chat nào đang chạy và chat nào đang đợi bạn (dấu "!"). Bộ đếm `N cần bạn` cho biết có bao nhiêu chat cần bạn.
- Khi cửa sổ ở nền, nếu một agent hỏi bạn thì macOS hiện thông báo và biểu tượng Dock hiện số chat đang đợi.
- Khi một lượt chạy xong, macOS hiện thông báo "đã xong". Bạn có thể tắt loại thông báo này trong menu của app, mục "Báo khi Agent làm xong". Thông báo câu hỏi vẫn giữ nguyên.
- Sau mỗi lượt có một khối liệt kê các tệp đã sửa. Bấm vào một tệp để mở nó ở cột bên phải.
- Màn hình giới hạn sử dụng cho thấy các giới hạn mà từng nhà cung cấp báo về.
- "Văn phòng Agent" là một văn phòng pixel-art. Mỗi agent là một nhân vật, dáng điệu phản ánh trạng thái thật: ngồi làm ở bàn, vẫy tay khi cần bạn, dấu tích khi vừa xong, và một robot nhỏ cho agent con.

### Duyệt

- Yêu cầu quyền của Claude Code hiện thành một thẻ. Với việc sửa tệp, thẻ cho thấy thay đổi dưới dạng dòng bị xóa và dòng được thêm.
- Câu hỏi và kế hoạch của Claude Code cũng hiện ở đó. Phê duyệt của Codex cũng vậy.
- Câu hỏi từ một agent con của Claude đang chạy nền cũng hiện lên để bạn trả lời.

![Thẻ duyệt một thay đổi của Claude Code](images/duyet.png)

### Dừng

- Bạn dừng được một lượt đang chạy.
- Lượt đã dừng được ghi "Đã dừng lượt này."
- Lượt bị lỗi hiện lý do mà nhà cung cấp báo về.

### Tiếp

- Bạn gửi thêm tin khi lượt đang chạy.
- Bạn tải lại trang mà không mất lượt đang chạy.
- Mỗi chat có lựa chọn riêng về nơi chạy (Claude Code, Codex hoặc Antigravity), model và effort.
- Chat nháp không tạo gì ở nhà cung cấp cho đến tin đầu tiên.

## Dữ liệu và quyền riêng tư

- App không có tài khoản riêng và không gọi API model nào.
- Nội dung chat do chính công cụ Claude Code, Codex hoặc Antigravity của bạn gửi đi, không phải app.
- Server cục bộ chỉ nghe ở `127.0.0.1`.
- Dữ liệu riêng của app (một token cục bộ, cơ sở dữ liệu, log) nằm ở `~/Library/Application Support/Agent Workspace`.
- Xóa một chat hay một thư mục trong app không xóa gì ở phía nhà cung cấp.
- App chỉ ghi ra ngoài thư mục dữ liệu khi bạn yêu cầu. Ví dụ: bấm "Cài hook" ở mục "Nguồn trạng thái" thì app thêm một hook quan sát vào `~/.claude/settings.json` (Claude Code) hoặc `~/.gemini/config/hooks.json` (Antigravity). Nút "Gỡ hook" ở cùng chỗ sẽ gỡ nó đi.

## Chưa làm được

- Chat Antigravity chưa nhận tệp đính kèm.
- Với Antigravity, app mới hiện ba loại bước: đọc tệp, sửa tệp và chạy lệnh.
- Chỉ có bản cho macOS trên Apple silicon.
- App chưa được ký bằng Apple Developer ID và chưa được Apple công chứng, nên cần làm các bước "Vẫn mở" ở lần mở đầu.
- Đây là bản phát hành đầu tiên và mới được thử trên ít máy. Nếu app không mở được, hãy báo ở mục Issues.
- Giao diện chỉ có tiếng Việt.

## Gỡ cài đặt

1. Nếu bạn đã bấm "Cài hook" trong app, hãy bấm "Gỡ hook" trước. Lệnh hook trỏ tới vị trí của app nên sẽ hỏng khi app bị xóa hoặc dời chỗ.
2. Thoát `Agent Workspace`.
3. Kéo `Agent Workspace` từ thư mục Applications vào Thùng rác.
4. Nếu muốn xóa cả dữ liệu của app, xóa thư mục `~/Library/Application Support/Agent Workspace`.

## Hỏi và báo lỗi

Mở một issue ở https://github.com/dat08101999/agent-workspace/issues.

Khi báo lỗi, hãy ghi phiên bản app, phiên bản macOS, chat chạy ở nhà cung cấp nào, các bước bạn đã làm và điều bạn thấy. Đừng dán token hay nội dung chat nhạy cảm vào issue.
